// tooling
import { list } from 'postcss';
import getReplacedString from './get-replaced-string.js';
import setVariable from './set-variable.js';
import { getMixinParams } from './get-mixin-params.js';

// transform @mixin at-rules
export default function transformMixinAtrule(rule, opts) {
  // if @mixin is supported
  if (opts.transform.includes('@mixin')) {
    // @mixin options
    const { name, params } = getMixinOpts(rule, opts);

    // set the mixin as a variable on the parent of the @mixin at-rule
    setVariable(rule.parent, `@mixin ${name}`, { params, rule }, opts);

    // remove the @mixin at-rule
    rule.remove();
  }
}

// return the @mixin statement options (@mixin NAME, @mixin NAME(PARAMS))
const getMixinOpts = (node, opts) => {
  // @mixin name and default params ([{ name, value }, ...])
  const parsed = getMixinParams(node.params);

  return {
    name: parsed.name,
    params: parsed.params.map((param) => {
      const parts = list.split(param, [':'], false);
      const paramName = parts[0].slice(1);
      const paramValue =
        parts.length > 1
          ? getReplacedString(parts.slice(1).join(':'), node, opts)
          : undefined;

      return { name: paramName, value: paramValue };
    }),
  };
};
