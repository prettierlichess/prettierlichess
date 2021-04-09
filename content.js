const colorScheme = ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor", "surfaceColor", "surfaceColorHover", "defaultWhite", "arrowPrimary", "arrowSecondary", "arrowTertiary", "arrowAlternate", "lastMove", "preMove", "moveIndicator", "boardDark", "boardLight"]

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

//Top Navigation

const tabSelector = document.querySelectorAll('#topnav section>a');
const tabGroup = document.querySelectorAll('[role="group"]');

tabSelector.forEach((item, index) => {
    item.addEventListener('mouseenter', e => {
        if (item.nextSibling == tabGroup[index]) {
            item.nextSibling.classList.add('topnavHover');
        }
    })

    item.addEventListener('mouseleave', e => {
        if (item.nextSibling == tabGroup[index]) {
            item.nextSibling.classList.remove('topnavHover');
        }
    })

    item.nextSibling.addEventListener('mouseenter', e => {
        if (item.nextSibling == tabGroup[index]) {
            item.nextSibling.classList.add('topnavHover');
        }
    })

    item.nextSibling.addEventListener('mouseleave', e => {
        if (item.nextSibling == tabGroup[index]) {
            item.nextSibling.classList.remove('topnavHover');
        }
    })
})