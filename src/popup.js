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
	preMove: '#1B7CC7',
	moveIndicator: '#99d69e',
	boardDark: '#71828F',
	boardLight: '#c7c7c7',
};
const basicImportContainer = document.querySelector('#basicImportContainer');
const basicImportInput = document.querySelector('#basicImport');
const importExportActionButton = document.querySelector('#importExportAction');
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
 * @param {string} code - The code to execute
 */
function tabScript(code) {
	chrome.tabs.query({}, function (tabs) {
		for (let i = 0; i < tabs.length; i++) {
			// All tabs that the extension has no permission to
			// have undefined as url
			if (tabs[i].url !== undefined) {
				chrome.tabs.executeScript(tabs[i].id, {
					code: code,
				});
			}
		}
	});
}
/**
 * Reload each tab for which the extension has permission
 */
function reloadAllTabs() {
	tabScript('window.location.reload();');
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

	// Creating a script to add the two color variables to the style
	const baseScript =
		'document.documentElement.setAttribute("style", (document.documentElement.getAttribute("style") ? document.documentElement.getAttribute("style") : "")';
	const colorScript = `+ "--${scheme}: ${color} !important;`;
	const RGBcolorScript = `--${scheme}RGB: ${r}, ${g}, ${b} !important;")`;

	tabScript(baseScript + colorScript + RGBcolorScript);

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
		let json = JSON.parse(data);
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

siteTab.addEventListener('click', focusSiteTab);
boardTab.addEventListener('click', focusBoardTab);

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

resetButton.addEventListener('click', () => {
	chrome.storage.sync.clear();
	reloadAllTabs();
	location.reload();
});

//Import File Selector
var fileSelector = document.createElement('input');
fileSelector.setAttribute('type', 'file');
fileSelector.onchange = function () {
	console.log(fileSelector.value);
	let file = fileSelector.files[0];
	let reader = new FileReader();

	reader.onload = function (e) {
		console.log(e.target.result);
		importScheme(e.target.result);
	};
	reader.readAsText(file);
};

const IMPORT_EXPORT_MODE = Object.freeze({
	IMPORT: 'import',
	EXPORT: 'export',
});

let importExportMode = null;

/**
 * Set basic import/export container visibility
 * @param {boolean} isVisible
 * @returns
 */
const setBasicImportExportVisibility = (isVisible) =>
	(basicImportContainer.style.display = isVisible ? 'block' : 'none');
/**
 * Set the import export color mode
 * @param {'import' | 'export'} mode
 */
const setImportExportMode = (mode) => {
	const label = mode === IMPORT_EXPORT_MODE.IMPORT ? 'Save' : 'Close';
	importExportMode = mode;
	importExportActionButton.textContent = label;
	if (mode === IMPORT_EXPORT_MODE.EXPORT) {
		basicImportInput.focus();
	} else if (mode === IMPORT_EXPORT_MODE.IMPORT) {
		basicImportInput.value = '';
	}
};

importButton.addEventListener('click', () => {
	if (isFirefox) {
		setBasicImportExportVisibility(true);
		setImportExportMode(IMPORT_EXPORT_MODE.IMPORT);
	} else {
		fileSelector.click();
	}
	// ???
	return false;
});

importExportActionButton.addEventListener('click', () => {
	if (importExportMode === 'import') {
		importScheme(basicImportInput.value.trim());
	} else {
		setBasicImportExportVisibility(false);
		setImportExportMode(null);
	}
});

exportButton.addEventListener('click', () => {
	chrome.storage.sync.get(null, function (result) {
		let json = {};
		let color;
		for (let scheme in defaultColorScheme) {
			color = result[scheme];
			if (color) {
				json[scheme] = color;
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
			});
		} else {
			alert('No custom colors have been set.');
		}
	});
});

chrome.storage.sync.get('defaultBoardSwitch', function (result) {
	if (result['defaultBoardSwitch']) {
		hideBoardColors.textContent = 'Use Custom Board Colors';
		hideBoardColorSelectors();
		hideBoardColors.addEventListener('click', () => {
			boardSwitch(false);
		});
	} else {
		hideBoardColors.addEventListener('click', () => {
			boardSwitch(true);
		});
	}
});

//Functions
function boardSwitch(toggle) {
	setColor(
		`boardDark`,
		toggle ? transparent : defaultColorScheme['boardDark']
	);
	setColor(
		`boardLight`,
		toggle ? transparent : defaultColorScheme['boardLight']
	);

	syncSet('toggledCustomBoard', true);
	window.location.reload();

	syncSet('defaultBoardSwitch', toggle);
	reloadAllTabs();
}
