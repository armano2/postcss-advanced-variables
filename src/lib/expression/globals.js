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
