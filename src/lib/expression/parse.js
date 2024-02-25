import { TokenType } from '@csstools/css-tokenizer';
import { tokenizer } from './tokenizer.js';
import { nodeTypes, operatorChars } from './globals.js';

export function parseExpression(code, node) {
  const rootNode = { type: nodeTypes.Expression, children: [] };
  if (!code) {
    return rootNode;
  }
  const tokens = tokenizer(code, node);
  const outStack = [rootNode];

  while (!tokens.nextIs(TokenType.EOF)) {
    const token = tokens.next();
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
          if (tokens.nextIs(TokenType.Delim)) {
            operator += tokens.next()[1];
          }
          outStack.push({
            type: nodeTypes.Expression,
            operator: operator,
            children: [lastNode.children.pop()],
          });
        } else if (value === '$') {
          tokens.expect(TokenType.Ident);
          const next = tokens.next();
          lastNode.children.push({
            type: nodeTypes.Variable,
            value: next[1],
          });
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
