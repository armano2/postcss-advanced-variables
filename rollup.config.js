import esbuild from 'rollup-plugin-esbuild';
import packageJson from './package.json' with { type: 'json' };

export default {
  input: 'src/index.js',
  output: [
    { file: 'lib/index.cjs', format: 'cjs' },
    { file: 'lib/index.mjs', format: 'esm' },
  ],
  external: [
    'node:process',
    'node:path',
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.peerDependencies),
  ],
  plugins: [
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      target: 'node18', // default, or 'es20XX', 'esnext'
      // target: ['node18']
    }),
  ],
};
