import express from 'express';
import cors from 'cors';
import { parse } from '@babel/parser';
import { checkBrackets } from './utils/bracketChecker.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/api/analyze', (req, res) => {
  try {
    const { code } = req.body;
    if (typeof code !== 'string') {
      return res.status(400).json({ errors: [{ message: 'Invalid code input', line: null, column: null }] });
    }
    const errors = [];

    // Syntax parsing
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

    // Bracket checking
    const bracketErrors = checkBrackets(code);
    errors.push(...bracketErrors);

    return res.json({ errors });
  } catch (err) {
    return res.status(500).json({ errors: [{ message: 'Internal server error', line: null, column: null }] });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
