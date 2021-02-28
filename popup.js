const colorScheme = ["primaryColor", "secondaryColor", "tertiaryColor", "backgroundColor", "surfaceColor", "surfaceColorHover", "defaultWhite"]
const colorDefaults = ["#9FC0A2", "#f5c276", "#d36d6d", "#2B343B", "#3F474D", "#4e565c", "#F2F5F3"]

const primaryColor = document.querySelector('#primaryColor');

const pickr = new Pickr({
    el: primaryColor,
    default: '#42445A',
    theme: 'nano',

    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],

    components: {
        preview: true,
        opacity: true,
        hue: true,

        interaction: {
            hex: true,
            rgba: true,
            hsva: true,
            input: true,
            clear: true,
            save: true
        }
    }
});

colorScheme.forEach(scheme => colorPickerSet(scheme));
colorScheme.forEach(scheme => addChangeListener(scheme));

document.querySelector('#resetButton').addEventListener('click', () => {
    document.getElementById("list").reset();

    let scheme = null
    for (i = 0; i < colorScheme.length; i++) {
        scheme = colorScheme[i]
        chrome.storage.sync.set({
            [scheme]: colorDefaults[i]
        });
    }
    tabScript('window.location.reload();');
})

function addChangeListener(scheme) {
    let schemeElement = document.getElementById(scheme);

    schemeElement.addEventListener('change', (element) => {
        let color = element.target.value;
        let schemeCode = 'document.documentElement.setAttribute("style", (document.documentElement.getAttribute("style") ? document.documentElement.getAttribute("style") : "") + "--' + scheme + ': ' + color + ' !important;")'

        tabScript(schemeCode);

        chrome.storage.sync.set({
            [scheme]: color
        });
    });
}

function colorPickerSet(scheme) {
    let schemeElement = document.getElementById(scheme);

    chrome.storage.sync.get(scheme, function (result) {
        if (result[scheme]) {
            schemeElement.setAttribute('value', result[scheme]);
        }
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