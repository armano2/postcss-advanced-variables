import { describe, it } from 'node:test';
import {
  evaluateExpression,
  parseExpression,
} from '../src/lib/tokenize-expression.js';
import assert from 'node:assert';

describe('evaluateExpression', () => {
  const cases = {
    // operators
    '1 + 2': 3,
    '1 - 2': -1,
    '1 * 2': 2,
    '1 / 2': 0.5,
    '1 % 2': 1,
    '+2': 2,
    '-2': -2,
    '8 % 3': 2,
    true: true,
    '2 == 2': true,
    '2 != 2': false,
    '2 < 2': false,
    '2 > 2': false,
    '2 <= 2': true,
    '2 >= 2': true,
    // precedence
    '1 + 2 * 3': 7,
    '1 + 2 * 3 / 4': 2.5,
    '(1 + 2) * 3': 9,
    '1 + (2 * 3)': 9,
    // functions
    'calc(1) + 2': 'calc(1) + 2',
    'var(--test) + 2': 'var(--test) + 2',
  };

  for (const [expression, result] of Object.entries(cases)) {
    it(`should evaluate ${expression}`, () => {
      const node = parseExpression(expression);
      assert.deepStrictEqual(evaluateExpression(node, null, {}), result);
    });
  }
});
