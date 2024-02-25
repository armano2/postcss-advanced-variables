export const operatorChars = ['+', '-', '*', '/', '%', '<', '>', '!', '='];

export const operatorInfo = {
  '+': { precedence: 1, math: (a, b) => a + b },
  '-': { precedence: 1, math: (a, b) => a - b },
  '*': { precedence: 2, math: (a, b) => a * b },
  '/': { precedence: 2, math: (a, b) => a / b },
  '%': { precedence: 2, math: (a, b) => a % b },
  '<': { precedence: 3, math: (a, b) => a < b },
  '>': { precedence: 3, math: (a, b) => a > b },
  '<=': { precedence: 3, math: (a, b) => a <= b },
  '>=': { precedence: 3, math: (a, b) => a >= b },
  '!=': { precedence: 3, math: (a, b) => a !== b },
  '==': { precedence: 3, math: (a, b) => a === b },
  and: { precedence: 4, math: (a, b) => a && b },
  or: { precedence: 5, math: (a, b) => a || b },
  // 'not': { precedence: 6, math: (a) => !a },
  // '(': { precedence: 7 },
  // ')': { precedence: 7 },
  // ',': { precedence: 7 },
};

export const nodeTypes = {
  Variable: 'Variable',
  Identifier: 'Identifier',
  Expression: 'Expression',
  CallExpression: 'CallExpression',
  ParenExpression: 'ParenExpression',
  ColonExpression: 'ColonExpression',
  ComaExpression: 'ComaExpression',
  Literal: 'Literal',
};
