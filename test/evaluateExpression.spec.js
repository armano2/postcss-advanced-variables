import { describe, it } from 'node:test';
import assert from 'node:assert';

import { evaluateExpression } from '../src/lib/expression/evaluate.js';
import { parseExpression } from '../src/lib/expression/parse.js';

describe('evaluateExpression', () => {
  const cases = {
    // identifiers
    123: 123,
    true: true,
    false: false,
    "'string'": "'string'",
    '"string"': '"string"',
    // operators
    '1 + 2': 3,
    '1 - 2': -1,
    '1 * 2': 2,
    '1 / 2': 0.5,
    '1 % 2': 1,
    '+2': 2,
    '-2': -2,
    '8 % 3': 2,
    '2 == 2': true,
    '2 != 2': false,
    '2 < 2': false,
    '2 > 2': false,
    '2 <= 2': true,
    '2 >= 2': true,
    // precedence
    '1 + 2 * 3': 7,
    '3 * 2 + 10 / 2': 11,
    '1 + 2 * 3 / 4': 2.5,
    '7 + 2 * 2 - 5': 6,
    '7 + 2 * (2 - 5)': 1,
    '(5 + 2) * (2 - 7)': -35,
    '(3 + 8) * 7 - 6': 71,
    '9 * 8 * 7 - 1': 503,
    '(1 + 2) * 3': 9,
    '1 + (2 * 3)': 7,
    '2 == (1 + 1)': true,
    '(1 + 1) == 1': false,
    // functions
    'calc(1) + 2': 'calc(1) + 2',
    'var(--test) + 2': 'var(--test) + 2',
    'var(--bar)': 'var(--bar)',
    // with strings
    "my-var * test + 'string'": "my-var * test + 'string'",
  };

  for (const [expression, result] of Object.entries(cases)) {
    it(`should evaluate ${expression}`, () => {
      const node = parseExpression(expression);
      assert.deepStrictEqual(evaluateExpression(node, null, {}), result);
    });
  }
});
