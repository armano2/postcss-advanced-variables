import { tokenize } from '@csstools/css-tokenizer';
import { createError } from './createError.js';

export function tokenizer(code, parent) {
  let index = 0;
  const tokens = tokenize({ css: code });

  function nextIs(type) {
    return tokens[index][0] === type;
  }

  function expect(type) {
    if (!nextIs(type)) {
      createError(
        `Unexpected token, expected ${type} but got ${tokens[index][0]} instead.`,
        parent,
      );
    }
    return true;
  }
  function next() {
    return tokens[index++];
  }

  function skip(type) {
    while (nextIs(type)) {
      ++index;
    }
  }

  return { nextIs, expect, next, skip };
}
