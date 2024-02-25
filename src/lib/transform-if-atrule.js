// tooling
import transformNode from './transform-node';
import { evaluateExpression } from './tokenize-expression';

// transform @if at-rules
export default function transformIfAtrule(rule, opts) {
  // @if options
  const isTruthy = evaluateExpression(rule, opts);
  const next = rule.next();

  const transformAndInsertBeforeParent = (node) =>
    transformNode(node, opts).then(() =>
      node.parent.insertBefore(node, node.nodes),
    );

  return ifPromise(opts.transform.includes('@if'), () =>
    ifPromise(isTruthy, () => transformAndInsertBeforeParent(rule)).then(() => {
      rule.remove();
    }),
  ).then(() =>
    ifPromise(opts.transform.includes('@else') && isElseRule(next), () =>
      ifPromise(!isTruthy, () => transformAndInsertBeforeParent(next)).then(
        () => {
          next.remove();
        },
      ),
    ),
  );
}

const ifPromise = (condition, trueFunction) =>
  Promise.resolve(condition && trueFunction());

// return whether the node is an else at-rule
const isElseRule = (node) =>
  Object(node) === node && 'atrule' === node.type && 'else' === node.name;
