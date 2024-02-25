import { describe, it } from 'node:test';
import assert from 'node:assert';

import { parseExpression } from '../src/lib/expression/parse.js';

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
            { type: 'Literal', value: 1 },
            { type: 'Literal', value: 2 },
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
            { type: 'Literal', value: 1 },
            {
              type: 'Expression',
              operator: '*',
              children: [
                { type: 'Literal', value: 3 },
                { type: 'Literal', value: 2 },
              ],
            },
          ],
        },
      ],
    },
    '1 * 3 + 2': {
      type: 'Expression',
      children: [
        {
          type: 'Expression',
          operator: '+',
          children: [
            {
              type: 'Expression',
              operator: '*',
              children: [
                { type: 'Literal', value: 1 },
                { type: 'Literal', value: 3 },
              ],
            },
            { type: 'Literal', value: 2 },
          ],
        },
      ],
    },
    '(1 + 3) * 2': {
      type: 'Expression',
      children: [
        {
          type: 'Expression',
          operator: '*',
          children: [
            {
              type: 'ParenExpression',
              children: [
                {
                  type: 'Expression',
                  operator: '+',
                  children: [
                    { type: 'Literal', value: 1 },
                    { type: 'Literal', value: 3 },
                  ],
                },
              ],
            },
            { type: 'Literal', value: 2 },
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
            { type: 'Literal', value: 1 },
            {
              type: 'ParenExpression',
              children: [
                {
                  type: 'Expression',
                  operator: '*',
                  children: [
                    { type: 'Literal', value: 3 },
                    { type: 'Literal', value: 2 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    '(--test + 2)': {
      type: 'Expression',
      children: [
        {
          type: 'ParenExpression',
          children: [
            {
              type: 'Expression',
              operator: '+',
              children: [
                { type: 'Identifier', value: '--test' },
                { type: 'Literal', value: 2 },
              ],
            },
          ],
        },
      ],
    },
    '(--test)': {
      type: 'Expression',
      children: [
        {
          type: 'ParenExpression',
          children: [{ type: 'Identifier', value: '--test' }],
        },
      ],
    },
    'var(--test)': {
      type: 'Expression',
      children: [
        {
          type: 'CallExpression',
          value: 'var',
          children: [{ type: 'Identifier', value: '--test' }],
        },
      ],
    },
    'var(--test) + 2': {
      type: 'Expression',
      children: [
        {
          operator: '+',
          type: 'Expression',
          children: [
            {
              type: 'CallExpression',
              value: 'var',
              children: [{ type: 'Identifier', value: '--test' }],
            },
            {
              type: 'Literal',
              value: 2,
            },
          ],
        },
      ],
    },
  };

  for (const [expression, result] of Object.entries(cases)) {
    it(`should parse a expression ${expression}`, () => {
      const node = parseExpression(expression);

      assert.deepStrictEqual(node, result);
    });
  }
});
