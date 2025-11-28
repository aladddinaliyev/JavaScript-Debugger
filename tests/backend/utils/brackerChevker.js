import { checkBrackets } from '../../backend/utils/bracketChecker.js';

describe('checkBrackets', () => {
  it('should return no errors for balanced brackets', () => {
    const code = `
      function test() {
        const arr = [1, 2, 3];
        if (arr.length > 0) { return arr[0]; }
      }
    `;
    const errors = checkBrackets(code);
    expect(errors).toHaveLength(0);
  });

  it('should detect unmatched opening bracket', () => {
    const code = 'function test( { return 1;';
    const errors = checkBrackets(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.includes('Unmatched opening bracket'))).toBeTruthy();
  });

  it('should detect unmatched closing bracket', () => {
    const code = 'function test() } return 1;';
    const errors = checkBrackets(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.includes('Unmatched closing bracket'))).toBeTruthy();
  });

  it('should detect mismatched brackets', () => {
    const code = 'function test() { return [1, 2, 3); }';
    const errors = checkBrackets(code);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.includes('Mismatched closing bracket'))).toBeTruthy();
  });

  it('should handle multiple bracket errors simultaneously', () => {
    const code = '{[)]}';
    const errors = checkBrackets(code);
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it('should return empty array for empty string', () => {
    const errors = checkBrackets('');
    expect(errors).toHaveLength(0);
  });
});
