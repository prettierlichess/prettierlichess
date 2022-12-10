import Pickr from '@simonwep/pickr';

const colorScheme = [
	'primaryColor',
	'secondaryColor',
	'tertiaryColor',
	'backgroundColor',
	'surfaceColor',
	'surfaceColorHover',
	'defaultWhite',
	'textColor',
	'arrowPrimary',
	'arrowSecondary',
	'arrowTertiary',
	'arrowAlternate',
	'lastMove',
	'preMove',
	'moveIndicator',
	'boardDark',
	'boardLight',
];
const colorDefaults = [
	'#9FC0A2',
	'#f5c276',
	'#d36d6d',
	'#272a2c',
	'#333538',
	'#404246',
	'#F2F5F3',
	'#AAAAAA',
	'#68C07B',
	'#f3ae48',
	'#d64d4d',
	'#4b81e6',
	'#99d69e',
	'#1B7CC7',
	'#99d69e',
	'#71828F',
	'#c7c7c7',
];
const styleTernary =
	'document.documentElement.setAttribute("style", (document.documentElement.getAttribute("style") ? document.documentElement.getAttribute("style") : "") + "--';
const basicImportExportContainer = document.getElementById(
	'basicImportExportContainer'
);
const basicImportExportInput = document.getElementById('basicImportExport');
const importExportActionButton = document.getElementById('importExportAction');
const useBasicImportExport = navigator.userAgent.indexOf('Firefox') !== -1;
const transparent = 'FFFFFF00';
const boardDark = colorScheme[14];
const boardDarkDefault = colorDefaults[14];
const boardLight = colorScheme[15];
const boardLightDefault = colorDefaults[15];

//tab elements
const siteTab = document.querySelector('#siteTab');
const boardTab = document.querySelector('#boardTab');
const siteColorGroup = document.querySelector('#siteColorGroup');
const boardColorGroup = document.querySelector('#boardColorGroup');
const boardColorSelector = document.querySelectorAll('.boardColorSelector');
const hideBoardColors = document.querySelector('#hideBoardColors');

const reloadIfLichess = `
let lichessEx = new RegExp(".*lichess.org.*");
let apiEx = new RegExp(".*lichess.org/api.*");
let currentURL = location.href;
if (lichessEx.test(currentURL) && !apiEx.test(currentURL)){window.location.reload();}`;

// refocus hack
chrome.storage.sync.get('hideCustomBoard', function (result) {
	if (result['hideCustomBoard']) {
		focusBoardTab();
		syncSet('hideCustomBoard', false);
	}
});

// Set layout selector
chrome.storage.sync.get('layoutPreference', function (result) {
	result = result['layoutPreference'];
	console.debug('Result:', result);
	let inOptions = false;
	let optionNodes = document.querySelector('#layoutSelect').children;

	for (let i = 0; i < optionNodes.length; i++) {
		console.debug(optionNodes[i].value);
		if (optionNodes[i].value === result) {
			inOptions = true;
		}
	}

	console.debug('In options:', inOptions);

	if (!inOptions) {
		result = 'default';
	}
	document.querySelector('#layoutSelect').value = result;
});

document.querySelector('#layoutSelect').addEventListener('change', function () {
	syncSet('layoutPreference', document.querySelector('#layoutSelect').value);
	tabScript(reloadIfLichess);
});

// Tab Switch

siteTab.addEventListener('click', () => {
	focusSiteTab();
});

boardTab.addEventListener('click', () => {
	focusBoardTab();
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
	(basicImportExportContainer.style.display = isVisible ? 'block' : 'none');
/**
 * Toggle visiblity of the basic import/export container
 */
const toggleBasicImportExport = () => {
	const isHidden = basicImportExportContainer.style.display === 'none';
	setBasicImportExportVisibility(!isHidden);
};

/**
 * Set the import export color mode
 * @param {'import' | 'export'} mode
 */
const setImportExportMode = (mode) => {
	const label = mode === IMPORT_EXPORT_MODE.IMPORT ? 'Save' : 'Close';
	importExportMode = mode;
	importExportActionButton.textContent = label;
	if (mode === IMPORT_EXPORT_MODE.EXPORT) {
		basicImportExportInput.focus();
	} else if (mode === IMPORT_EXPORT_MODE.IMPORT) {
		basicImportExportInput.value = '';
	}
};

const importScheme = (data) => {
	chrome.storage.sync.get(null, function (result) {
		let json = JSON.parse(data);
		if (result['defaultBoardSwitch']) {
			json[boardLight] = transparent;
			json[boardDark] = transparent;
		}
		console.log(json['primaryColor']);
		let schemeCode, scheme, color;
		for (let i = 0; i < colorScheme.length; i++) {
			scheme = colorScheme[i];
			color = json[scheme] ? json[scheme] : colorDefaults[i];
			if (color) {
				let r = parseInt(color.substring(1, 3), 16);
				let g = parseInt(color.substring(3, 5), 16);
				let b = parseInt(color.substring(5, 7), 16);

				schemeCode =
					styleTernary + scheme + ': ' + color + ' !important;"';
				schemeCode +=
					' + "--' +
					scheme +
					'RGB: ' +
					`${r}, ${g}, ${b}` +
					' !important;")';

				tabScript(schemeCode);
				syncSet(scheme, color);
			}
		}
	});
	location.reload();
};

// Generate Color Pickers
for (let i = 0; i < colorScheme.length; i++) {
	pickrCreate(colorScheme[i], colorDefaults[i]);
}

// Add button events
document.querySelector('#resetButton').addEventListener('click', () => {
	chrome.storage.sync.clear();
	tabScript(reloadIfLichess);
	location.reload();
});
document.querySelector('#importButton').addEventListener('click', () => {
	if (useBasicImportExport) {
		setBasicImportExportVisibility(true);
		setImportExportMode(IMPORT_EXPORT_MODE.IMPORT);
	} else {
		fileSelector.click();
	}
	return false;
});

importExportActionButton.addEventListener('click', () => {
	if (importExportMode === 'import') {
		importScheme(basicImportExportInput.value.trim());
	} else {
		setBasicImportExportVisibility(false);
		setImportExportMode(null);
	}
});

document.querySelector('#exportButton').addEventListener('click', () => {
	chrome.storage.sync.get(null, function (result) {
		let json = {};
		let color;
		for (let i = 0; i < colorScheme.length; i++) {
			color = result[colorScheme[i]];
			if (color) {
				json[colorScheme[i]] = color;
			}
		}
		if (result['defaultBoardSwitch']) {
			delete json[boardLight];
			delete json[boardDark];
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
	let schemeCode, color;

	color = toggle ? transparent : boardDarkDefault;
	schemeCode = styleTernary + boardDark + ': ' + color + ' !important;")';
	tabScript(schemeCode);
	syncSet(boardDark, color);

	color = toggle ? transparent : boardLightDefault;
	schemeCode = styleTernary + boardLight + ': ' + color + ' !important;")';
	tabScript(schemeCode);
	syncSet(boardLight, color);

	syncSet('hideCustomBoard', true);
	window.location.reload();

	syncSet('defaultBoardSwitch', toggle);
	tabScript(reloadIfLichess);
}

function pickrCreate(scheme, color) {
	chrome.storage.sync.get(scheme, function (result) {
		color = result[scheme] ? result[scheme] : color;

		let schemeElement = document.querySelector(`#${scheme}`);
		let pickr = new Pickr({
			el: schemeElement,
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

		pickr.on('save', (color) => {
			let rgbValues = color.toRGBA();
			let r = Math.floor(rgbValues[0]);
			let g = Math.floor(rgbValues[1]);
			let b = Math.floor(rgbValues[2]);

			color = color.toHEXA().toString();
			console.log('setting color to: ' + color);
			let schemeCode =
				styleTernary + scheme + ': ' + color + ' !important;"';
			schemeCode +=
				' + "--' +
				scheme +
				'RGB: ' +
				`${r}, ${g}, ${b}` +
				' !important;")';

			tabScript(schemeCode);

			syncSet(scheme, color);
		});
	});
}

function tabScript(code) {
	chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		function (tabs) {
			chrome.tabs.executeScript(tabs[0].id, {
				code: code,
			});
		}
	);
}

function syncSet(scheme, value) {
	chrome.storage.sync.set({
		[scheme]: value,
	});
}

function focusSiteTab() {
	siteTab.classList.add('active');
	boardTab.classList.remove('active');
	siteColorGroup.classList.remove('hideGroup');
	boardColorGroup.classList.add('hideGroup');
}

function focusBoardTab() {
	siteTab.classList.remove('active');
	boardTab.classList.add('active');
	siteColorGroup.classList.add('hideGroup');
	boardColorGroup.classList.remove('hideGroup');
}

const hideBoardColorSelectors = () => {
	boardColorSelector.forEach((item) => {
		item.style.display = 'none';
	});
};
