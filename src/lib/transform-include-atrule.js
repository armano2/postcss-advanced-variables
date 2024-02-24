// tooling
import getClosestVariable from './get-closest-variable';
import getReplacedString from './get-replaced-string';
import manageUnresolved from './manage-unresolved.js';
import setVariable from './set-variable';
import transformNode from './transform-node';
import { getMixinParams } from './get-mixin-params';

// transform @include at-rules
export default function transformIncludeAtrule(rule, opts) {
  // if @include is supported
  if (opts.transform.includes('@include')) {
    // @include options
    const { name, params } = getMixinParams(rule.params);

    // the closest @mixin variable
    const mixin = getClosestVariable(`@mixin ${name}`, rule.parent, opts);

    // if the @mixin variable exists
    if (mixin) {
      // set @mixin variables on the @include at-rule
      mixin.params.forEach((param, index) => {
        const arg =
          index in params
            ? getReplacedString(params[index], rule, opts)
            : param.value;

        setVariable(rule, param.name, arg, opts);
      });

      // clone the @mixin at-rule
      const clone = mixin.rule.clone({
        original: rule,
        parent: rule.parent,
        variables: rule.variables,
      });

      // transform the clone children
      return transformNode(clone, opts).then(() => {
        // replace the @include at-rule with the clone children
        rule.parent.insertBefore(rule, clone.nodes);

        rule.remove();
      });
    } else {
      // otherwise, if the @mixin variable does not exist
      manageUnresolved(
        rule,
        opts,
        name,
        `Could not resolve the mixin for "${name}"`,
      );
    }
  }
}
