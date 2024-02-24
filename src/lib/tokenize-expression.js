import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import getClosestVariable from './get-closest-variable';
import manageUnresolved from './manage-unresolved';

function replaceVariable(name, node, opts) {
  // the closest variable value
  const value = getClosestVariable(name, node.parent, opts);

  // if a variable has not been resolved
  if (undefined === value) {
    manageUnresolved(
      node,
      opts,
      name,
      `Could not resolve the variable "$${name}"`,
    );
  }
  if (!isNaN(value)) {
    return Number(value);
  }
  return value;
}

const nodeTypes = {
  Unknown: 'UnknownExpression',
  Variable: 'Variable',
  Identifier: 'Identifier',
  Expression: 'Expression',
  CallExpression: 'CallExpression',
  ParenExpression: 'ParenExpression',
  ColonExpression: 'ColonExpression',
  ComaExpression: 'ComaExpression',
  Number: 'Number',
};

const operatorChars = ['+', '-', '*', '/', '%', '<', '>', '!', '='];

function compare(children, operation) {
  if (children.length !== 2) {
    throw new Error(`Unsupported expression ${operation}`);
  }
  // TODO: implement support for unresolved variables and string operations
  return operation(children[0], children[1]);
}

const operatorTypes = {
  '+': (children) => compare(children, (a, b) => a + b),
  '*': (children) => compare(children, (a, b) => a * b),
  '/': (children) => compare(children, (a, b) => a / b),
  '%': (children) => compare(children, (a, b) => a % b),
  '-': (children) => compare(children, (a, b) => a - b),
  '<': (children) => compare(children, (a, b) => a < b),
  '>': (children) => compare(children, (a, b) => a > b),
  '<=': (children) => compare(children, (a, b) => a <= b),
  '>=': (children) => compare(children, (a, b) => a >= b),
  '!=': (children) => compare(children, (a, b) => a !== b),
  '==': (children) => compare(children, (a, b) => a === b),
};

export function parseExpression(node) {
  const tokens = tokenizer({
    css: node.params,
  });
  const outStack = [{ type: nodeTypes.Expression, children: [] }];

  while (!tokens.endOfFile()) {
    const token = tokens.nextToken();
    const [type, value, start, end] = token;

    const lastNode = outStack[outStack.length - 1];

    switch (type) {
      case TokenType.OpenParen:
        outStack.push({
          type: nodeTypes.ParenExpression,
          children: [],
        });
        break;
      case TokenType.CloseParen:
        const node = outStack.pop();
        outStack[outStack.length - 1].children.push(node);
        break;
      case TokenType.Number:
        lastNode.children.push({
          type: nodeTypes.Number,
          value: parseInt(value),
        });
        break;
      case TokenType.Ident:
        if (value === 'true' || value === 'false') {
          lastNode.children.push({
            type: nodeTypes.Identifier,
            value: value === 'true',
          });
          break;
        }
        lastNode.children.push({
          type: nodeTypes.Identifier,
          value: value,
        });
        break;
      case TokenType.Delim:
        if (operatorChars.includes(value)) {
          let operator = value;
          const next = tokens.nextToken();
          if (next && next[0] === TokenType.Delim) {
            operator += next[1];
          }
          outStack.push({
            type: nodeTypes.Expression,
            operator: operator,
            children: [lastNode.children.pop()],
          });
        } else if (value === '$') {
          const next = tokens.nextToken();
          if (next && next[0] === TokenType.Ident) {
            lastNode.children.push({
              type: nodeTypes.Variable,
              value: next[1],
            });
          } else {
            throw new Error('Unsupported variable');
          }
        }
        break;
      case TokenType.Function:
        outStack.push({
          type: nodeTypes.CallExpression,
          value: token[4].value,
          children: [],
        });
        break;
      case TokenType.Whitespace:
        // skip
        break;
      default:
        throw new Error(`Unsupported ${type}[${value}]`);
    }

    if (
      lastNode.children.length > 1 &&
      lastNode.type === nodeTypes.Expression
    ) {
      const node = outStack.pop();
      outStack[outStack.length - 1].children.push(node);
    }
  }

  if (outStack.length === 1) {
    throw new Error(
      `stack seem to be not correct ${outStack.length}, there seem to be something wrong with the expression ${node.params}`,
    );
  }

  return outStack.pop();
}

export function evaluateExpression(parent, opts) {
  if (!parent.params) {
    return parent.params;
  }
  const nodeTree = parseExpression(parent);

  function visitAst(node) {
    switch (node.type) {
      case nodeTypes.Variable:
        return replaceVariable(node.value, parent, opts);
      case nodeTypes.Identifier:
        return node.value;
      case nodeTypes.Number:
        return node.value;
      case nodeTypes.CallExpression: {
        const children = node.children.map(visitAst);

        return `${node.value}(${children.join(', ')})`;
      }
      case nodeTypes.ParenExpression:
      case nodeTypes.Expression:
        if (node.operator) {
          const children = node.children.map(visitAst);
          const operator = operatorTypes[node.operator];
          if (typeof operator === 'function') {
            return operator(children);
          }
          return children;
        }
        return visitAst(node.children[0]);
      default:
        throw new Error(`!Unsupported node type ${node.type}`);
    }
  }

  return visitAst(nodeTree);
}
