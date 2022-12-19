// All Chrome-API functions are replaced.
// This code is added to the beginning of popup.js when an http server is started.

const conversions = {
	true: true,
	false: false,
};
const chrome = {
	storage: {
		sync: {
			// The synced storage is mocked with localStorage
			get: function (request, caller) {
				// This conversion is necessary because synced can store all
				// data types and localStorage can only store strings.
				let convertedLocalStorage = {};

				for (let key in localStorage) {
					let value = localStorage[key];

					if (value in conversions) {
						value = conversions[value];
					}
					convertedLocalStorage[key] = value;
				}
				caller(convertedLocalStorage);
			},
			set: async function (items) {
				for (let item in items) {
					await localStorage.setItem(item, items[item]);
				}
			},
			clear: async function () {
				await localStorage.clear();
			},
		},
	},
	// The downloads-API is simulated with a HTML element
	downloads: {
		download: function (options) {
			let link = document.createElement('a');
			link.setAttribute('download', options['filename']);
			link.href = options['url'];
			link.click();
		},
	},
	// The tab functions are not simulated but still replaced to avoid errors
	tabs: {
		query: function (properties, caller) {
			caller([
				{id: 0, url: 'https://www.lichess.org'},
				{id: 1, url: 'https://www.lichess.org'},
				{id: 2, url: undefined},
			]);
			console.log(
				`[Mock] chrome.tabs.query(${JSON.stringify(properties)})`
			);
		},
		executeScript: function (id, properties) {
			console.log(
				`[Mock] chrome.tabs.executeScript(${JSON.stringify(
					id
				)}, ${JSON.stringify(properties)})`
			);
		},
	},
};
