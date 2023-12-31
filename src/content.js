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
const STREAMER_STYLES = `
@media (min-width: 800px),
(orientation: landscape) {

    main div.round__app {
        grid-template-columns: minmax(calc(70vmin * var(--board-scale)), calc(100vh * var(--board-scale) - calc(var(--site-header-height) + var(--site-header-margin)) - 3rem)) minmax(240px, 400px);
        grid-template-rows: 50px 1fr auto min-content 3fr auto min-content auto 1fr 50px !important;
        grid-template-areas: 'user-top .''board voice''board mat-top''board expi-top''board moves''board controls''board expi-bot''board mat-bot''board .''user-bot .''kb-move .';
    }

    rm6 {
        background: var(--surfaceColor);
        border-top: 2px solid var(--surfaceColorHover);
        border-bottom: 2px solid var(--surfaceColorHover);
        border-radius: var(--borderRadius);
    }

    .round__app .rclock-top {
        padding-bottom: 10px;
        padding-top: 5px;
        grid-area: user-top;
    }

    .round__app .rclock-bottom {
        padding-top: 10px;
        padding-bottom: 5px;
        grid-area: user-bot;
    }

    .round__app .round__app__table {
        grid-area: 4 / 2 / 6 / 3;
    }
    
    .rclock {
        display: inline;
    }

    .rclock > * {
        float: right;
        z-index: 5;
        position: relative;
    }

    .rclock .tour-rank,
    .rclock .moretime,
    .rclock .berserked {
        order: -1;
    }

    .rclock .bar {
        display: none;
    }

    .rclock .time {
        padding-left: 5px;
        padding-right: 5px;
        font-size: 2em;
        line-height: 0px;
        height: 100%;
        width: 10ch;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-family: 'Red Hat Display', sans-serif;
    }

    .rclock.running .time {
        opacity: 1;
        color: var(--defaultWhite) !important;
    }

    .rclock .time::before {
        content: '';
        top: 0;
        left: 0;
        position: absolute;
        width: 98%;
        height: 100%;
        background: var(--defaultWhite);
        opacity: .1;
        border-radius: 4px;
        z-index: -1;
    }

    .rclock.running .time::before {
        background: var(--primaryColor) !important;
        opacity: .5 !important;
    }

    .rclock.emerg.running .time::before {
        background: var(--tertiaryColor);
    }

    .round__app .ruser {
        font-size: 16px;
        padding: 0em !important;
        line-height: 14px;
        background:none;
        border: none !important;
        border-radius: 0;
        align-items: center;
    }

    .ruser-bottom {
        margin-top: 5px;
    }

    .ruser-top {
        margin-bottom: 5px;
    }

    .ruser a {
        overflow: visible;
        flex: none;
    }

    .rcontrols {
        margin-top: 10px;
        background: var(--surfaceColor);
        border: 2px solid var(--surfaceColorHover);
        border-radius: var(--borderRadius);
    }

    .ricons {
        margin-top: 8px;
    }

    .round__underboard:empty {
        display: none;
    }
}

#top .site-buttons a[title="Moderation"] {
    display: none;
}
`;

const LAYOUT_CHANGE = `
main.lobby {
	grid-template-areas:
		'app tv tv side'
		'table blog blog support'
		'leader puzzle puzzle winner'
		'feed puzzle puzzle .'
		'feed tours tours .'
		'. simuls simuls .'
		'. about about .';
	grid-template-columns: minmax(400px, 1fr) 1fr 1fr minmax(400px, 1fr);
	grid-template-rows: minmax(1fr, 800px) repeat(2, fit-content(0));
}
.lobby__app,
.lobby__side {
	height: calc(100% - 40px) !important;
}
`;

colorScheme.forEach((scheme) => schemeSet(scheme));
console.debug('Scheme set');

function schemeSet(scheme) {
	chrome.storage.sync.get(scheme, function (result) {
		console.log(scheme + ' : ' + result[scheme]);
		if (result[scheme]) {
			let getStyle = document.documentElement.getAttribute('style');
			let appendStyle = getStyle ? getStyle : '';

			let r = parseInt(result[scheme].substring(1, 3), 16);
			let g = parseInt(result[scheme].substring(3, 5), 16);
			let b = parseInt(result[scheme].substring(5, 7), 16);

			let setVar = `--${scheme}: ${result[scheme]} !important;`;
			let setRGBVar = `--${scheme}RGB: ${r}, ${g}, ${b} !important;`;

			document.documentElement.setAttribute(
				'style',
				`${appendStyle} ${setVar} ${setRGBVar}`
			);
		}
	});
}

// Coordinates

//Check if using default board
//if true, use lichess variable
//else use custom variables

chrome.storage.sync.get(null, function (result) {
	let darkCoord = result['defaultBoardSwitch']
		? 'var(--cg-coord-color-black)'
		: 'var(--boardDark)';
	let lightCoord = result['defaultBoardSwitch']
		? 'var(--cg-coord-color-white)'
		: 'var(--boardLight)';
	let getStyle = document.documentElement.getAttribute('style');
	let appendStyle = getStyle ? getStyle : '';
	document.documentElement.setAttribute(
		'style',
		`${appendStyle} --coordDark: ${darkCoord} !important; --coordLight: ${lightCoord} !important;`
	);
});

function addVerticalLayoutButton(result) {
	result = result['streamerMode'];
	console.debug('Result: ', result);
	if (result) {
		console.debug('enableStreamerMode');
		enableStreamerMode();
	}

	console.debug('Creating button');
	var button = document.createElement('button');
	button.textContent = result
		? 'Disable Vertical Layout'
		: 'Enable Vertical Layout';
	button.classList.add('button');
	button.classList.add('streamerButton');

	console.debug('Add click event');

	button.addEventListener('click', function () {
		if (result) {
			syncSet('streamerMode', false);
			window.location.reload();
		} else {
			syncSet('streamerMode', true);
			window.location.reload();
		}
	});

	document.querySelector('.round').appendChild(button);

	console.debug('Added button');
}

chrome.storage.sync.get('layoutPreference', function (result) {
	if (result['layoutPreference'] !== 'lichess') {
		let styleSheet = document.createElement('style');
		styleSheet.type = 'text/css';
		styleSheet.innerText = LAYOUT_CHANGE;

		if (result['layoutPreference'] === 'default-1440') {
			styleSheet.innerText +=
				'\nbody #main-wrap {--main-max-width: 2500px !important;}';
		}

		if (document.head) {
			document.head.appendChild(styleSheet);
		} else {
			const obs = new MutationObserver(function () {
				if (document.head) {
					obs.disconnect();
					document.head.appendChild(styleSheet);
				}
			});
			obs.observe(document.documentElement, {
				childList: true,
				subtree: true,
			});
		}
	}
});

// Setup Streamer mode button only runs on match/tv pages
chrome.storage.sync.get('streamerMode', function (result) {
	const round = document.querySelector('.round');
	console.debug('Round: ', round);

	if (round) {
		addVerticalLayoutButton(result);
	} else {
		const obs = new MutationObserver(function () {
			if (document.querySelector('.round')) {
				console.debug('Found .round');
				obs.disconnect();
				addVerticalLayoutButton(result);
			}
		});
		obs.observe(document.documentElement, {childList: true, subtree: true});
		console.debug('Connected MutationObserver');
	}
});

function enableStreamerMode() {
	var styleSheet = document.createElement('style');
	styleSheet.type = 'text/css';
	styleSheet.innerText = STREAMER_STYLES;
	document.head.appendChild(styleSheet);
}

function syncSet(scheme, value) {
	chrome.storage.sync.set({
		[scheme]: value,
	});
}

// Allowing to clear sync storage for cypress
window.addEventListener('message', function (event) {
	if (event.source !== window) {
		return;
	}
	if (event.data.type === 'cypress' && event.data.command === 'sync.clear') {
		chrome.storage.sync.clear();
	}
});
