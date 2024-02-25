import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import getClosestVariable from './get-closest-variable.js';
import manageUnresolved from './manage-unresolved.js';

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
  Variable: 'Variable',
  Identifier: 'Identifier',
  Expression: 'Expression',
  CallExpression: 'CallExpression',
  ParenExpression: 'ParenExpression',
  ColonExpression: 'ColonExpression',
  ComaExpression: 'ComaExpression',
  Literal: 'Literal',
};

const operatorChars = ['+', '-', '*', '/', '%', '<', '>', '!', '='];

const operatorInfo = {
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

function compare(values, operation) {
  const operator = operatorInfo[operation];
  if (!operator) {
    throw new Error(`Unsupported operator ${operation}`);
  }
  if (values.length !== 2) {
    throw new Error(`Unsupported expression ${operation}`);
  }
  if (values.some((value) => typeof value !== 'number')) {
    // console.log(values);
    return values.join(` ${operation} `);
  }
  return operator.math(values[0], values[1]);
}

export function parseExpression(code) {
  const rootNode = { type: nodeTypes.Expression, children: [] };
  if (!code) {
    return rootNode;
  }
  const tokens = tokenizer({ css: code });
  const outStack = [rootNode];

  while (!tokens.endOfFile()) {
    const token = tokens.nextToken();
    const [type, value] = token;

    const lastNode = outStack[outStack.length - 1];

    switch (type) {
      case TokenType.OpenParen:
        outStack.push({
          type: nodeTypes.ParenExpression,
          children: [],
        });
        break;
      case TokenType.CloseParen: {
        const node = outStack.pop();
        outStack[outStack.length - 1].children.push(node);
        break;
      }
      case TokenType.Number:
        lastNode.children.push({
          type: nodeTypes.Literal,
          value: parseInt(value),
        });
        break;
      case TokenType.Ident:
        if (value === 'true' || value === 'false') {
          lastNode.children.push({
            type: nodeTypes.Literal,
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

  const lastNode = outStack[outStack.length - 1];
  if (lastNode.type === nodeTypes.Expression && lastNode.operator) {
    const node = outStack.pop();
    outStack[outStack.length - 1].children.push(node);
  }

  if (outStack.length !== 1) {
    throw new Error(`Something went wrong while parsing code "${code}"`);
  }

  return outStack.pop();
}

export function evaluateExpression(nodeTree, parent, opts) {
  function visitAst(node) {
    switch (node.type) {
      case nodeTypes.Variable:
        return replaceVariable(node.value, parent, opts);
      case nodeTypes.Identifier:
        return node.value;
      case nodeTypes.Literal:
        return node.value;
      case nodeTypes.CallExpression: {
        const children = node.children.map(visitAst);

        return `${node.value}(${children.join(', ')})`;
      }
      case nodeTypes.ParenExpression:
      case nodeTypes.Expression:
        if (node.operator) {
          const children = node.children.map(visitAst);
          return compare(children, node.operator);
        }
        return visitAst(node.children[0]);
      default:
        throw new Error(`!Unsupported node type ${node.type}`);
    }
  }

  return visitAst(nodeTree);
}
