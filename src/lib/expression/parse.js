import { TokenType } from '@csstools/css-tokenizer';
import { tokenizer } from './tokenizer.js';
import { nodeTypes, operatorChars, operatorInfo } from './globals.js';
import { createError } from './createError.js';
import util from 'node:util';

const debug = false;
function debugLog(message, data) {
  if (debug) {
    console.log(message, util.inspect(data, { depth: 10 }));
  }
}

function checkPrecedence(node, operation, parent) {
  const operator = operatorInfo[operation];
  if (!operator) {
    throw createError(`Unsupported operator ${operation}`, parent);
  }

  // if (
  //   node.type === nodeTypes.ParenExpression ||
  //   node.type === nodeTypes.CallExpression
  // ) {
  //   return false;
  // }

  const parentOperator = operatorInfo[node.operator];
  if (!parentOperator) {
    return true;
  }
  debugLog('checkPrecedence', node);

  return parentOperator.precedence < operator.precedence;
}

export function parseExpression(code, parent) {
  const rootNode = { type: nodeTypes.Expression, children: [] };
  if (!code) {
    return rootNode;
  }
  const tokens = tokenizer(code, parent);
  const outStack = [rootNode];

  debugLog('parseExpression', code);

  while (!tokens.nextIs(TokenType.EOF)) {
    const token = tokens.next();
    const [type, value] = token;

    const lastNode = outStack[outStack.length - 1];

    switch (type) {
      case TokenType.OpenParen: {
        const node = {
          type: nodeTypes.ParenExpression,
          children: [],
        };
        lastNode.children.push(node);
        outStack.push(node);
        break;
      }
      case TokenType.CloseParen: {
        outStack.pop();
        break;
      }
      case TokenType.String: {
        lastNode.children.push({
          type: nodeTypes.Literal,
          value: String(value),
        });
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
          if (tokens.nextIs(TokenType.Delim)) {
            operator += tokens.next()[1];
          }
          const node = {
            type: nodeTypes.Expression,
            operator: operator,
            children: [],
          };
          if (checkPrecedence(lastNode, operator, parent)) {
            node.children.push(lastNode.children.pop());
            lastNode.children.push(node);
            outStack.push(node);
          } else {
            debugLog('lastNode:tmp', lastNode);
            debugLog('node:tmp', node);
            const multi = outStack.pop();
            node.children.push(multi);
            outStack[outStack.length - 1].children.splice(-1, 1, node);
            outStack.push(node);

            debugLog('outStack:tmp', outStack);
            debugLog('rootNode:tmp', rootNode);
          }
        } else if (value === '$') {
          tokens.expect(TokenType.Ident);
          const next = tokens.next();
          lastNode.children.push({
            type: nodeTypes.Variable,
            value: next[1],
          });
        } else {
          throw createError(`Unexpected token ${type}[${value}]`, parent);
        }
        break;
      case TokenType.Function: {
        const node = {
          type: nodeTypes.CallExpression,
          value: token[4].value,
          children: [],
        };
        lastNode.children.push(node);
        outStack.push(node);
        break;
      }
      case TokenType.Whitespace:
        // skip
        break;
      default:
        throw createError(`Unexpected token ${type}[${value}]`, parent);
    }
  }

  debugLog('rootNode', rootNode);

  return rootNode;
}
