import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs/promises';

import rawPlugin from '../lib/index.mjs';
import postcssScss from 'postcss-scss';
import postcss from 'postcss';

const options = {
  default: {
    message: 'supports !default usage',
  },
  'default:var': {
    message: 'supports !default { variables } usage',
    options: {
      variables: {
        default: 'custom-value',
      },
    },
  },
  'default:var-func': {
    message: 'supports !default { variables() } usage',
    options: {
      variables: () => 'custom-fn-value',
    },
  },
  variables: {
    message: 'supports variables usage',
  },
  conditionals: {
    message: 'supports conditionals (@if, @else) usage',
  },
  'conditionals:disable': {
    message: 'supports disabled @if and @else usage',
    options: {
      disable: '@if, @else',
    },
  },
  'conditionals:disable-if': {
    message: 'supports disabled @if usage',
    options: {
      disable: '@if',
    },
  },
  'conditionals:disable-else': {
    message: 'supports disabled @else usage',
    options: {
      disable: '@else',
    },
  },
  iterators: {
    message: 'supports iterators (@for, @each) usage',
  },
  atrules: {
    message: 'supports generic at-rules usage',
  },
  mixins: {
    message: 'supports mixins usage',
  },
  imports: {
    message: 'supports @import usage',
  },
  'imports:no-from': {
    message: 'supports @import usage with no `from`',
    processOptions: {
      from: null,
    },
    options: {
      importRoot: 'test/fixtures',
    },
  },
  'imports-alt': {
    message: 'supports @import with { importPaths } usage',
    options: {
      importPaths: 'test/fixtures/imports',
    },
  },
  'imports-media': {
    message: 'supports @import with media usage',
  },
  'import-mixins': {
    message: 'supports @import with mixin usage',
  },
  'import-variables': {
    message: 'supports @import with variable usage',
  },
  mixed: {
    message: 'supports mixed usage',
  },
  scss: {
    message: 'supports scss interpolation',
    processOptions: {
      syntax: postcssScss,
    },
  },
  'imports-scss': {
    message: 'supports @import with scss syntax',
    processOptions: {
      syntax: postcssScss,
    },
  },
  'unresolved:ignore': {
    message: 'supports { unresolved: "ignore" } option',
    options: {
      unresolved: 'ignore',
    },
  },
  'unresolved-include:ignore': {
    message: 'supports { unresolved: "ignore" } option with mixins',
    options: {
      unresolved: 'ignore',
    },
  },
  'unresolved:throw': {
    message: 'supports { unresolved: "throw" } option',
    options: {
      unresolved: 'throw',
    },
    error: {
      reason:
        'Could not resolve the variable "$unresolved" within "$unresolved"',
    },
  },
  'unresolved-include:throw': {
    message: 'supports { unresolved: "throw" } option with mixins',
    options: {
      unresolved: 'throw',
    },
    error: {
      reason: 'Could not resolve the mixin for "@test-unresolved"',
    },
  },
  'unresolved:warn': {
    message: 'supports { unresolved: "warn" } option',
    options: {
      unresolved: 'warn',
    },
    warnings: [
      'Could not resolve the variable "$unresolved" within "$unresolved"',
    ],
  },
  'unresolved-include:warn': {
    message: 'supports { unresolved: "warn" } option with mixins',
    options: {
      unresolved: 'warn',
    },
    warnings: ['Could not resolve the mixin for "@test-unresolved"'],
  },
  property: {
    message: 'supports variable property names',
    processOptions: {
      syntax: postcssScss,
    },
  },
  each: {
    message: 'supports each',
    processOptions: {
      syntax: postcssScss,
    },
  },
};

describe('validate tests', () => {
  it('is postcss8 plugin', () => {
    assert.strictEqual(typeof rawPlugin, 'function');
    assert.strictEqual(rawPlugin.postcss, true);
  });
  for (const name in options) {
    const test = options[name];

    it(test.message, async () => {
      const testBase = name.split(':')[0];
      const testFull = name.split(':').join('.');

      const syntax = test.processOptions?.syntax ? 'scss' : 'css';

      const rootDir = './test/fixtures/';
      // test paths
      const sourcePath = path.resolve(rootDir, `${testBase}.${syntax}`);
      const expectPath = path.resolve(rootDir, `${testFull}.expect.${syntax}`);
      const resultPath = path.resolve(rootDir, `${testFull}.result.${syntax}`);

      const parseOptions = {
        from: sourcePath,
        to: resultPath,
        ...test.processOptions,
      };

      const sourceCSS = await fs.readFile(sourcePath, 'utf8');

      const instance = await postcss([rawPlugin(test.options)]);

      if ('error' in test) {
        await assert.rejects(
          () => instance.process(sourceCSS, parseOptions),
          test.error,
        );
        return;
      }

      let result = null;
      await assert.doesNotReject(async () => {
        result = await instance.process(sourceCSS, parseOptions);
      });

      const resultCode = result.css;

      const expectCSS = await fs
        .readFile(expectPath, 'utf8')
        .catch(() => fs.writeFile(expectPath, resultCode));

      await fs.writeFile(resultPath, resultCode);

      assert.strictEqual(resultCode, expectCSS);

      const warnings = result.messages
        .filter((m) => m.type === 'warning')
        .map((m) => m.text);

      assert.deepStrictEqual(warnings, test.warnings ?? []);
    });
  }
});
