const colorScheme = ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor", "surfaceColor", "surfaceColorHover", "defaultWhite", "textColor", "arrowPrimary", "arrowSecondary", "arrowTertiary", "arrowAlternate", "lastMove", "preMove", "moveIndicator", "boardDark", "boardLight"]

colorScheme.forEach(scheme => schemeSet(scheme));

function schemeSet(scheme) {
    chrome.storage.sync.get(scheme, function (result) {
        console.log(scheme + " : " + result[scheme]);
        if (result[scheme]) {
            let getStyle = document.documentElement.getAttribute('style');
            let appendStyle = getStyle ? getStyle : '';
            document.documentElement.setAttribute("style", `${appendStyle} --${scheme}: ${result[scheme]} !important;`);
        }
    });
}

// Coordinates

//Check if using default board
//if true, use lichess variable
//else use custom variables

chrome.storage.sync.get(null, function (result) {
    let darkCoord = result['defaultBoardSwitch'] ? 'var(--cg-coord-color-black)' : 'var(--boardDark)';
    let lightCoord = result['defaultBoardSwitch'] ? 'var(--cg-coord-color-white)' : 'var(--boardLight)';
    let getStyle = document.documentElement.getAttribute('style');
    let appendStyle = getStyle ? getStyle : '';
    document.documentElement.setAttribute("style", `${appendStyle} --coordDark: ${darkCoord} !important; --coordLight: ${lightCoord} !important;`);
})