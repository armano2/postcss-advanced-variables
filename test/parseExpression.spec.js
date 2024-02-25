import { parseExpression } from '../src/lib/tokenize-expression.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('parseExpression', () => {
  const cases = {
    true: {
      type: 'Expression',
      children: [{ type: 'Literal', value: true }],
    },
    false: {
      type: 'Expression',
      children: [{ type: 'Literal', value: false }],
    },
    '1 + 2': {
      type: 'Expression',
      children: [
        {
          type: 'Expression',
          operator: '+',
          children: [
            { type: 'Number', value: 1 },
            { type: 'Number', value: 2 },
          ],
        },
      ],
    },
    '1 + 3 * 2': {
      type: 'Expression',
      children: [
        {
          type: 'Expression',
          operator: '+',
          children: [
            { type: 'Number', value: 1 },
            {
              type: 'Expression',
              operator: '*',
              children: [
                { type: 'Number', value: 3 },
                { type: 'Number', value: 2 },
              ],
            },
          ],
        },
      ],
    },
    '(1 + 3) * 2': {
      type: 'Expression',
      children: [
        {
          type: 'Expression',
          operator: '+',
          children: [
            { type: 'Number', value: 1 },
            {
              type: 'Expression',
              operator: '*',
              children: [
                { type: 'Number', value: 3 },
                { type: 'Number', value: 2 },
              ],
            },
          ],
        },
      ],
    },
    '1 + (3 * 2)': {
      type: 'Expression',
      children: [
        {
          type: 'Expression',
          operator: '+',
          children: [
            { type: 'Number', value: 1 },
            {
              type: 'Expression',
              operator: '*',
              children: [
                { type: 'Number', value: 3 },
                { type: 'Number', value: 2 },
              ],
            },
          ],
        },
      ],
    },
    'var(--test) + 2': {
      children: [
        {
          children: [
            {
              children: [
                {
                  type: 'Identifier',
                  value: '--test',
                },
              ],
              type: 'CallExpression',
              value: 'var',
            },
            {
              type: 'Number',
              value: 2,
            },
          ],
          operator: '+',
          type: 'Expression',
        },
      ],
      type: 'Expression',
    },
  };

  for (const [expression, result] of Object.entries(cases)) {
    it(`should parse a expression ${expression}`, () => {
      const node = parseExpression(expression);
      assert.deepStrictEqual(node, result);
    });
  }
});
