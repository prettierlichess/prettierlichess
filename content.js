const colorScheme = ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor", "surfaceColor", "surfaceColorHover", "defaultWhite", "arrowPrimary", "arrowSecondary", "arrowTertiary", "arrowAlternate"]

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