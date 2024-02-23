import esbuild from 'rollup-plugin-esbuild'

export default {
	input: 'src/index.js',
	output: [
		{ file: 'lib/index.js', format: 'cjs' },
		{ file: 'lib/index.mjs', format: 'esm' }
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
