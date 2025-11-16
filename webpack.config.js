const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const browserTarget = process.env.BROWSER === 'firefox' ? 'firefox' : 'chrome';
const outputDir = browserTarget === 'firefox' ? 'dist-firefox' : 'dist-chrome';

module.exports = {
	mode: 'production',
	entry: {
		popup: './src/popup.js',
	},
	output: {
		path: path.resolve(process.cwd(), outputDir),
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: 'src',
					to: '.',
					globOptions: {
						ignore: ['./popup.js'],
					},
				},
				{
					from: './node_modules/@simonwep/pickr/dist/themes/nano.min.css',
					to: './nano.min.css',
				},
			],
		}),
	],
};
