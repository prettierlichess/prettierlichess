const colorScheme = ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor", "surfaceColor", "surfaceColorHover", "defaultWhite"]
const colorDefaults = ["#9FC0A2", "#f5c276", "#d36d6d", "#2B343B", "#3F474D", "#4e565c", "#F2F5F3"]


var i;
for (i = 0; i < colorScheme.length; i++) {
    pickrCreate(colorScheme[i], colorDefaults[i]);
}

document.querySelector('#resetButton').addEventListener('click', () => {
    chrome.storage.sync.clear()
    tabScript('window.location.reload();');
})

document.querySelector('#importButton').addEventListener('click', () => {
    console.log("Imported.")
})

document.querySelector('#exportButton').addEventListener('click', () => {
    console.log("Exported.")
})

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
                    save: true
                }
            }
        });

        pickr.on('save', (color) => {
            color = color.toHEXA().toString();
            console.log('setting color to: ' + color)
            console.log(typeof color)
            let schemeCode = 'document.documentElement.setAttribute("style", (document.documentElement.getAttribute("style") ? document.documentElement.getAttribute("style") : "") + "--' + scheme + ': ' + color + ' !important;")'

            tabScript(schemeCode);

            chrome.storage.sync.set({
                [scheme]: color
            });

        });
    });
}

function tabScript(code) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: code
            });
    });
}