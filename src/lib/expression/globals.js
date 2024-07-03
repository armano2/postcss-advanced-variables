export const operatorChars = ['+', '-', '*', '/', '%', '<', '>', '!', '='];

export const operatorInfo = {
  not: { precedence: 0, math: (a) => !a, arguments: 1 },
  '*': { precedence: 1, math: (a, b) => a * b },
  '/': { precedence: 1, math: (a, b) => a / b },
  '%': { precedence: 1, math: (a, b) => a % b },
  '+': { precedence: 2, math: (a, b) => a + b },
  '-': { precedence: 2, math: (a, b) => a - b },
  and: { precedence: 3, math: (a, b) => a && b },
  or: { precedence: 4, math: (a, b) => a || b },
  '<': { precedence: 5, math: (a, b) => a < b },
  '>': { precedence: 5, math: (a, b) => a > b },
  '<=': { precedence: 5, math: (a, b) => a <= b },
  '>=': { precedence: 5, math: (a, b) => a >= b },
  '!=': { precedence: 5, math: (a, b) => a !== b },
  '==': { precedence: 5, math: (a, b) => a === b },
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
