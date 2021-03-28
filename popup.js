const colorScheme = ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor", "surfaceColor", "surfaceColorHover", "defaultWhite"]
const colorDefaults = ["#9FC0A2", "#f5c276", "#d36d6d", "#2B343B", "#3F474D", "#4e565c", "#F2F5F3"]
const styleTernary = 'document.documentElement.setAttribute("style", (document.documentElement.getAttribute("style") ? document.documentElement.getAttribute("style") : "") + "--'


var fileSelector = document.createElement('input');
fileSelector.setAttribute('type', 'file');
fileSelector.onchange = function(){
    console.log(fileSelector.value)
    let file = fileSelector.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
        console.log(e.target.result)
        let json = JSON.parse(e.target.result)
        console.log(json["primaryColor"])
        let schemeCode, scheme, color
        for (let i = 0; i < colorScheme.length; i++){
            scheme = colorScheme[i]
            color = json[colorScheme[i]]
            schemeCode = styleTernary + scheme + ': ' + color + ' !important;")'
            tabScript(schemeCode);

            chrome.storage.sync.set({
                [scheme]: color
            });
        }
        location.reload()
    };
    reader.readAsText(file)
}


for (let i = 0; i < colorScheme.length; i++) {
    pickrCreate(colorScheme[i], colorDefaults[i]);
}

document.querySelector('#resetButton').addEventListener('click', () => {
    chrome.storage.sync.clear()
    tabScript('window.location.reload();');
})

document.querySelector('#importButton').addEventListener('click', () => {
    fileSelector.click()
    return false
})

document.querySelector('#exportButton').addEventListener('click', () => {
    chrome.storage.sync.get(null, function (result) {
        let json = {}
        let color;
        for (let i = 0; i < colorScheme.length; i++){
            color = result[colorScheme[i]] ? result[colorScheme[i]] : colorDefaults[i]
            json[colorScheme[i]] = color
        }
        console.log(json)
        json = new Blob([JSON.stringify(json, null, 2)], {type: "application/json"});
        let url = URL.createObjectURL(json);
        chrome.downloads.download({
            url: url // The object URL can be used as download URL
        });
        console.log("Exported.")
    });
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
            let schemeCode = styleTernary + scheme + ': ' + color + ' !important;")'

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