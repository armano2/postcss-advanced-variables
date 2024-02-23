// tooling
import getReplacedString from './get-replaced-string.js';

// transform rule nodes
export default function transformRule(rule, opts) {
	// update the rule selector with its variables replaced by their corresponding values
	rule.selector = getReplacedString(rule.selector, rule, opts);
}
