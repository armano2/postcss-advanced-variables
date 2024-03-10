import { TokenType } from '@csstools/css-tokenizer';
import { tokenizer } from './tokenizer.js';
import { nodeTypes, operatorChars, operatorInfo } from './globals.js';
import { createError } from './createError.js';
import util from 'node:util';

const debug = false;
function debugLog(message, data) {
  if (debug) {
    if (!data) {
      console.log(message);
    } else {
      console.log(message, util.inspect(data, { depth: 50, colors: true }));
    }
  }
}

function checkPrecedence(a, b, parent) {
  debugLog('checkPrecedence[a]', a.operator);
  debugLog('checkPrecedence[b]', b.operator);

  const operator = operatorInfo[b.operator]?.precedence;
  if (!operator) {
    throw createError(`Unsupported operator ${b.operator}`, parent);
  }

  const parentOperator = operatorInfo[a.operator]?.precedence;
  if (!parentOperator) {
    debugLog('checkPrecedence[result]', 'parentOperator is not defined');
    return true;
  }
  const result = parentOperator > operator;
  debugLog('checkPrecedence', result);
  return result;
}

export function parseExpression(code, rootElement) {
  const rootNode = { type: nodeTypes.Expression, children: [] };
  if (!code) {
    return rootNode;
  }
  const tokens = tokenizer(code, rootElement);

  debugLog('----------------');
  debugLog('parseExpression', code);

  function readDelimNode(token) {
    if (operatorChars.includes(token[1])) {
      const node = {
        type: nodeTypes.Expression,
        operator: token[1],
        children: [],
      };
      if (tokens.nextIs(TokenType.Delim)) {
        node.operator += tokens.next()[1];
      }
      return node;
    } else if (token[1] === '$') {
      tokens.expect(TokenType.Ident);
      return {
        type: nodeTypes.Variable,
        value: tokens.next()[1],
      };
    } else {
      throw createError(
        `Unexpected token ${token[0]}[${token[1]}]`,
        rootElement,
      );
    }
  }

  function readIdentNode(token) {
    switch (token[1]) {
      case 'not': {
        tokens.skip(TokenType.Whitespace);
        const next = tokens.next();
        return {
          type: nodeTypes.Expression,
          operator: 'not',
          children: [readStatement(next)],
        };
      }
      case 'and':
      case 'or':
        return {
          type: nodeTypes.Expression,
          operator: token[1],
          children: [],
        };
      case 'true':
      case 'false':
        return {
          type: nodeTypes.Literal,
          value: token[1] === 'true',
        };
      default:
        return {
          type: nodeTypes.Identifier,
          value: token[1],
        };
    }
  }

  function readStatement(token) {
    switch (token[0]) {
      case TokenType.OpenParen:
        return {
          type: nodeTypes.ParenExpression,
          children: parseStatement(TokenType.CloseParen),
        };
      case TokenType.Function:
        return {
          type: nodeTypes.CallExpression,
          value: token[4].value,
          children: parseStatement(TokenType.CloseParen),
        };
      case TokenType.Ident:
        return readIdentNode(token);
      case TokenType.String:
        return {
          type: nodeTypes.Literal,
          value: String(token[1]),
        };
      case TokenType.Number:
        return {
          type: nodeTypes.Literal,
          value: parseInt(token[1]),
        };
      case TokenType.Delim:
        return readDelimNode(token);
      case TokenType.Whitespace:
        // skip
        break;
      default:
        throw createError(
          `Unexpected token ${token[0]}[${token[1]}]`,
          rootElement,
        );
    }
  }

  function parseStatement(endTokenType) {
    const result = { type: 'Root', children: [] };
    const expressionStack = [result];

    while (!tokens.nextIs(endTokenType)) {
      const part = readStatement(tokens.next());
      if (!part) {
        // skip spaces
        continue;
      }
      debugLog('------------');
      debugLog('adding', part);
      if (result.children.length === 0) {
        debugLog('result.length === 0', result.length === 0);
        result.children.push(part);
        continue;
      }

      const lastExpression = expressionStack[expressionStack.length - 1];
      if (part.type === nodeTypes.Expression) {
        if (checkPrecedence(lastExpression, part, rootElement)) {
          debugLog('checkPrecedence[true]', part.operator);
          part.children.push(lastExpression.children.pop());
          lastExpression.children.push(part);
          expressionStack.push(part);
        } else {
          debugLog('checkPrecedence[false]', part.operator);
          expressionStack.pop();
          part.children.push(lastExpression);
          expressionStack[expressionStack.length - 1].children.pop();
          expressionStack[expressionStack.length - 1].children.push(part);
          expressionStack.push(part);
        }
      } else {
        lastExpression.children.push(part);
      }

      debugLog('expressionStack', expressionStack);
    }
    tokens.expect(endTokenType);
    tokens.next();
    debugLog('result', result.children);
    return result.children;
  }

  rootNode.children = parseStatement(TokenType.EOF);

  debugLog('rootNode', rootNode);

  return rootNode;
}
