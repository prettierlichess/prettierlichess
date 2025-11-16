import Pickr from '@simonwep/pickr';

const transparent = '#FFFFFF00';
const defaultColorScheme = {
	primaryColor: '#9FC0A2',
	secondaryColor: '#f5c276',
	tertiaryColor: '#d36d6d',
	backgroundColor: '#272a2c',
	surfaceColor: '#333538',
	surfaceColorHover: '#404246',
	defaultWhite: '#F2F5F3',
	textColor: '#AAAAAA',
	arrowPrimary: '#68C07B',
	arrowSecondary: '#f3ae48',
	arrowTertiary: '#d64d4d',
	arrowAlternate: '#4b81e6',
	lastMove: '#99d69e',
	preMove: '#1b7cc733',
	moveIndicator: '#0000003b',
	boardDark: '#71828F',
	boardLight: '#c7c7c7',
};
const basicImportContainer = document.querySelector('#basicImportContainer');
const basicImportInput = document.querySelector('#basicImport');
const importActionButton = document.querySelector('#importAction');
const resetButton = document.querySelector('#resetButton');
const importButton = document.querySelector('#importButton');
const exportButton = document.querySelector('#exportButton');

const siteTab = document.querySelector('#siteTab');
const boardTab = document.querySelector('#boardTab');
const siteColorGroup = document.querySelector('#siteColorGroup');
const boardColorGroup = document.querySelector('#boardColorGroup');
const boardColorSelector = document.querySelectorAll('.boardColorSelector');
const hideBoardColors = document.querySelector('#hideBoardColors');

// In Firefox, a different method is used for importing.
// To do this, it is necessary to check which browser is being used
const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

// If the "custom board"-setting is toggled, the popup is reloaded.
// To make sure that the correct tab is displayed again after reloading,
// it is saved whether the custom board setting has just been changed.
chrome.storage.sync.get('toggledCustomBoard', function (result) {
	if (result['toggledCustomBoard']) {
		focusBoardTab();
		syncSet('toggledCustomBoard', false);
	}
});
/**
 * Switch to site tab
 */
function focusSiteTab() {
	siteTab.classList.add('active');
	boardTab.classList.remove('active');
	siteColorGroup.classList.remove('hideGroup');
	boardColorGroup.classList.add('hideGroup');
}
/**
 * Switch to board tab
 */
function focusBoardTab() {
	siteTab.classList.remove('active');
	boardTab.classList.add('active');
	siteColorGroup.classList.add('hideGroup');
	boardColorGroup.classList.remove('hideGroup');
}
/**
 * Set the layout options dropdown to the given value
 * @param {string} option - Chosen option
 */
function setLayoutOption(option) {
	document.querySelector('#layoutSelect').value = 'default';
	const optionNodes = document.querySelector('#layoutSelect').children;

	// Check if the chosen option exists. Set it, if it does.
	for (let i = 0; i < optionNodes.length; i++) {
		if (optionNodes[i].value === option) {
			document.querySelector('#layoutSelect').value = option;
		}
	}
}
/**
 * Hide all selectors for board colors
 */
function hideBoardColorSelectors() {
	hideBoardColors.textContent = 'Use Custom Board Colors';
	boardColorSelector.forEach((colorSelector) => {
		colorSelector.style.display = 'none';
	});
}
/**
 * Create a new Pickr element
 * @param {string} replaceElement - The element to replace
 * @param {string} color - The default color
 * @returns {Pickr} - The created Pickr
 */
function createSinglePickr(replaceElement, color) {
	return new Pickr({
		el: replaceElement,
		default: color,
		theme: 'nano',
		components: {
			preview: true,
			opacity: true,
			hue: true,
			interaction: {
				hex: true,
				input: true,
				save: true,
			},
		},
	});
}
/**
 * Save a variable in synced storage
 * @param {string} key
 * @param {string | boolean} value
 */
function syncSet(key, value) {
	chrome.storage.sync.set({[key]: value});
}
/**
 * Execute code for every open tab
 * @param {Function} func - The code to execute
 * @param {Object} [params]  - Optional serializable parameters
 */
function tabScript(func, params) {
	// Validate function
	if (typeof func !== 'function') {
		console.error('Invalid function provided to tabScript');
		return;
	}

	// Validate params are JSON-serializable
	if (params !== undefined) {
		try {
			JSON.parse(JSON.stringify(params));
		} catch (err) {
			console.error('Parameters must be JSON-serializable:', err);
			return;
		}
	}

	chrome.tabs.query({}, function (tabs) {
		try {
			for (let i = 0; i < tabs.length; i++) {
				if (tabs[i].url !== undefined) {
					// Use chrome.scripting when available (MV3/Chromium).
					if (chrome.scripting && chrome.scripting.executeScript) {
						chrome.scripting
							.executeScript({
								target: {tabId: tabs[i].id},
								func: func,
								args: params !== undefined ? [params] : [],
							})
							.catch((err) =>
								console.error('Script execution failed:', err)
							);
					} else if (chrome.tabs && chrome.tabs.executeScript) {
						// Fallback for Firefox/MV2: inject via tabs.executeScript
						const invocation =
							'(' +
							func.toString() +
							')(' +
							(params !== undefined
								? JSON.stringify(params)
								: '') +
							');';
						chrome.tabs.executeScript(
							tabs[i].id,
							{code: invocation},
							function () {
								if (chrome.runtime.lastError) {
                                    // Some pages may reject injection; log and continue
									console.error(
										'Script execution failed:',
										chrome.runtime.lastError.message
									);
								}
							}
						);
					}
				}
			}
		} catch (err) {
			console.error('Error in tabScript:', err);
		}
	});
}
/**
 * Reload each tab for which the extension has permission
 */
function reloadAllTabs() {
	tabScript(function () {
		window.location.reload();
	});
}
/**
 * Changes a color by changing it in the tab and synced storage
 * @param {string} scheme - The name of the color (like primaryColor)
 * @param {string} color - Color in HEX
 */
function setColor(scheme, color) {
	let r = parseInt(color.substring(1, 3), 16);
	let g = parseInt(color.substring(3, 5), 16);
	let b = parseInt(color.substring(5, 7), 16);

	function createColorScript(params) {
		const scheme = params.scheme;
		const color = params.color;
		const r = params.r;
		const g = params.g;
		const b = params.b;

		document.documentElement.setAttribute(
			'style',
			(document.documentElement.getAttribute('style')
				? document.documentElement.getAttribute('style')
				: '') +
				`--${scheme}: ${color} !important;--${scheme}RGB: ${r}, ${g}, ${b} !important;`
		);
	}

	// Broadcast to all content scripts via runtime messaging (works in Firefox without tabs permission)
	if (chrome.runtime && chrome.runtime.sendMessage) {
		try {
			chrome.runtime.sendMessage({
				type: 'setColor',
				scheme: scheme,
				color: color,
				r: r,
				g: g,
				b: b,
			});
		} catch (e) {
			// Ignore messaging errors; script injection fallback below will still try
		}
	}

	tabScript(createColorScript, {
		scheme: scheme,
		color: color,
		r: r,
		g: g,
		b: b,
	});

	// Save color in synced storage
	syncSet(scheme, color);
}
/**
 * Creates a Pickr with correct value and change event
 * @param {string} scheme - The scheme of the pickr
 */
function pickrCreate(scheme) {
	chrome.storage.sync.get(scheme, function (result) {
		let pickr = createSinglePickr(
			document.querySelector(`#${scheme}`),
			result[scheme] ? result[scheme] : defaultColorScheme[scheme]
		);
		pickr.on('save', (color) => {
			setColor(scheme, color.toHEXA().toString());
		});
	});
}
/**
 * Imports a given JSON-scheme
 * @param {string} data - The imported JSON-scheme as a string
 */
function importScheme(data) {
	chrome.storage.sync.get(null, function (result) {
		chrome.storage.sync.clear();
		let json;
		try {
			json = JSON.parse(data);
		} catch {
			json = {};
			console.warn('Error while reading the specified JSON input data');
		}
		if (result['defaultBoardSwitch']) {
			json['boardLight'] = transparent;
			json['boardDark'] = transparent;
			// If the defaultBoardSwitch is activated it needs to be written
			// in the synced memory again after the sync.clear()
			syncSet('defaultBoardSwitch', true);
		}
		for (let scheme in defaultColorScheme) {
			if (json[scheme]) {
				setColor(scheme, json[scheme]);
			}
		}
	});
	location.reload();
	reloadAllTabs();
}
/**
 * Exports the current scheme as JSON file
 */
function exportScheme() {
	chrome.storage.sync.get(null, function (result) {
		let json = {};
		for (let scheme in defaultColorScheme) {
			if (result[scheme]) {
				json[scheme] = result[scheme];
			}
		}
		if (result['defaultBoardSwitch']) {
			delete json['boardLight'];
			delete json['boardDark'];
		}
		if (Object.keys(json).length > 0) {
			json = new Blob([JSON.stringify(json, null, 2)], {
				type: 'application/json',
			});
			let url = URL.createObjectURL(json);
			chrome.downloads.download({
				url: url, // The object URL can be used as download URL
				filename: 'prettierlichess_config.json',
				saveAs: false,
			});
		} else {
			alert('No custom colors have been set.');
		}
	});
}
/**
 * Toggle for default board
 * @param {boolean} noCustomBoard - If true: The default lichess board is used
 */
function boardSwitch(noCustomBoard) {
	setColor(
		`boardDark`,
		noCustomBoard ? transparent : defaultColorScheme['boardDark']
	);
	setColor(
		`boardLight`,
		noCustomBoard ? transparent : defaultColorScheme['boardLight']
	);
	syncSet('toggledCustomBoard', true);
	window.location.reload();

	syncSet('defaultBoardSwitch', noCustomBoard);
	reloadAllTabs();
}
/**
 * Set basic import container visibility
 * @param {boolean} isVisible
 */
function setBasicImportExportVisibility(isVisible) {
	basicImportContainer.style.display = isVisible ? 'block' : 'none';
}

siteTab.addEventListener('click', focusSiteTab);
boardTab.addEventListener('click', focusBoardTab);
exportButton.addEventListener('click', exportScheme);

chrome.storage.sync.get('layoutPreference', (result) =>
	setLayoutOption(result['layoutPreference'])
);

document.querySelector('#layoutSelect').addEventListener('change', function () {
	syncSet('layoutPreference', document.querySelector('#layoutSelect').value);
	reloadAllTabs();
});

for (let scheme in defaultColorScheme) {
	pickrCreate(scheme);
}

function resetToDefaults() {
	// Clear first, then set defaults and broadcast updates so pages reflect immediately.
	chrome.storage.sync.clear(function () {
		// Ensure board uses custom colors again by default
		syncSet('defaultBoardSwitch', false);
		// Apply default colors across all tabs and persist them
		for (let scheme in defaultColorScheme) {
			setColor(scheme, defaultColorScheme[scheme]);
		}
		// Optionally reset layout to default
		syncSet('layoutPreference', 'default');
		// Refresh the popup UI after values are written
		location.reload();
	});
}

resetButton.addEventListener('click', resetToDefaults);

// The defaultBoardSwitch attribute is true if the default
// lichess boards should be used
chrome.storage.sync.get('defaultBoardSwitch', function (result) {
	if (result['defaultBoardSwitch']) {
		hideBoardColorSelectors();
	}
	hideBoardColors.addEventListener('click', () => {
		boardSwitch(!result['defaultBoardSwitch']);
	});
});

let fileSelector = document.createElement('input');
fileSelector.id = 'fileSelector';
fileSelector.style.display = 'none';
fileSelector.setAttribute('type', 'file');
fileSelector.onchange = function () {
	let reader = new FileReader();

	reader.onload = function (e) {
		importScheme(e.target.result);
	};
	reader.readAsText(fileSelector.files[0]);
};
document.body.appendChild(fileSelector);

importButton.addEventListener('click', () => {
	// The input system works differently for firefox due
	// to this bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1292701
	// Do not try to change this before the bug is fixed
	if (isFirefox) {
		basicImportInput.value = '';
		setBasicImportExportVisibility(true);
	} else {
		fileSelector.click();
	}
});

importActionButton.addEventListener('click', () => {
	importScheme(basicImportInput.value.trim());
});
