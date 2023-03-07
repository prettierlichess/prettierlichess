const {defineConfig} = require('cypress');
const path = require('path');

module.exports = defineConfig({
	e2e: {
		defaultCommandTimeout: 10000,
		setupNodeEvents(on, config) {
			on('before:browser:launch', (browser, launchOptions) => {
				launchOptions.extensions.push(path.resolve(__dirname, 'dist'));
				return launchOptions;
			});
		},
	},
});
