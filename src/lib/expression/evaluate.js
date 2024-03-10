import { nodeTypes, operatorInfo } from './globals.js';
import getClosestVariable from '../get-closest-variable.js';
import manageUnresolved from '../manage-unresolved.js';
import { createError } from './createError.js';

function compare(values, operation, parent) {
  const operator = operatorInfo[operation];
  if (!operator) {
    throw createError(`Unsupported operator ${operation}`, parent);
  }
  if (values.length !== (operator.arguments ?? 2)) {
    throw createError(
      `Expression "${operation}" has to many arguments (${values.join(', ')})`,
      parent,
    );
  }
  if (values.some((value) => typeof value === 'string')) {
    return values.join(` ${operation} `);
  }
  return operator.math(values[0], values[1]);
}

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
      case nodeTypes.ParenExpression: {
        const children = node.children.map(visitAst);
        if (children.length === 1 && typeof children[0] !== 'string') {
          return children[0];
        }
        return `(${children.join(') (')})`;
      }
      case nodeTypes.Expression: {
        const children = node.children.map(visitAst);
        if (node.operator) {
          return compare(children, node.operator, parent);
        }
        if (node.children.length === 1) {
          return children[0];
        }
        return children.join(' ');
      }
      default:
        throw createError(`!Unsupported node type ${node.type}`, parent);
    }
  }

  return visitAst(nodeTree);
}
