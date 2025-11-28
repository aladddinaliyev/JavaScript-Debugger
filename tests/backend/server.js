import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { parse } from '@babel/parser';
import { checkBrackets } from '../../backend/utils/bracketChecker.js';
import serverModule from '../../backend/server.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', (req, res) => {
  try {
    const { code } = req.body;
    if (typeof code !== 'string') {
      return res.status(400).json({ errors: [{ message: 'Invalid code input', line: null, column: null }] });
    }
    const errors = [];

    try {
      parse(code, {
        sourceType: 'module',
        plugins: [
          'jsx',
          'typescript',
          'classProperties',
          'optionalChaining',
          'nullishCoalescingOperator',
          'objectRestSpread',
          'dynamicImport',
          'decorators-legacy',
          'classPrivateProperties',
          'classPrivateMethods',
          'numericSeparator',
          'topLevelAwait',
          'logicalAssignment',
          'bigInt',
          'optionalCatchBinding'
        ],
        errorRecovery: false
      });
    } catch (syntaxErr) {
      if (syntaxErr.loc) {
        errors.push({
          message: syntaxErr.message.replace(/\s*\(.+?\)$/, '').trim(),
          line: syntaxErr.loc.line,
          column: syntaxErr.loc.column + 1
        });
      } else {
        errors.push({
          message: syntaxErr.message,
          line: null,
          column: null
        });
      }
    }

    const bracketErrors = checkBrackets(code);
    errors.push(...bracketErrors);

    return res.json({ errors });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: 'Internal server error', line: null, column: null }] });
  }
});

describe('/api/analyze endpoint', () => {
  it('should return no errors for valid JS code', async () => {
    const validCode = 'function test() { return 123; }';
    const response = await request(app).post('/api/analyze').send({ code: validCode });
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBe(0);
  });

  it('should return syntax error for invalid JS code', async () => {
    const invalidCode = 'function () {';
    const response = await request(app).post('/api/analyze').send({ code: invalidCode });
    expect(response.statusCode).toBe(200);
    expect(response.body.errors.length).toBeGreaterThan(0);
    const syntaxError = response.body.errors.find(e => e.message.toLowerCase().includes('unexpected token') || e.message.toLowerCase().includes('unexpected'));
    expect(syntaxError).toBeDefined();
    expect(typeof syntaxError.line).toBe('number');
    expect(typeof syntaxError.column).toBe('number');
  });

  it('should detect unmatched brackets', async () => {
    const code = 'function test() { if(true) { return 1; ';
    const response = await request(app).post('/api/analyze').send({ code });
    expect(response.statusCode).toBe(200);
    const unmatched = response.body.errors.filter(e => e.message.toLowerCase().includes('unmatched'));
    expect(unmatched.length).toBeGreaterThan(0);
    unmatched.forEach(err => {
      expect(typeof err.line).toBe('number');
      expect(typeof err.column).toBe('number');
    });
  });

  it('should handle empty code input', async () => {
    const response = await request(app).post('/api/analyze').send({ code: '' });
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it('should return error for invalid request body', async () => {
    const response = await request(app).post('/api/analyze').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.errors.length).toBe(1);
    expect(response.body.errors[0].message).toBe('Invalid code input');
  });
});
