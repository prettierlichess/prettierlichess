document.querySelector('#resetButton').addEventListener('click', () => {
    document.getElementById("list").reset();
    chrome.storage.sync.set({
        "primaryColor": "#9FC0A2"
    });
    chrome.storage.sync.set({
        "secondaryColor": "#f5c276"
    });
    chrome.storage.sync.set({
        "tertiaryColor": "#d36d6d"
    });
    chrome.storage.sync.set({
        "backgroundColor": "#2B343B"
    });
    chrome.storage.sync.set({
        "surfaceColor": "#3F474D"
    });
    chrome.storage.sync.set({
        "surfaceColorHover": "#4e565c"
    });
    chrome.storage.sync.set({
        "defaultWhite": "#F2F5F3"
    });
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'window.location.reload();'
            });
    });
})

let primaryColor = document.getElementById('primaryColor');
let secondaryColor = document.getElementById('secondaryColor');
let tertiaryColor = document.getElementById('tertiaryColor');
let backgroundColor = document.getElementById('backgroundColor');
let surfaceColor = document.getElementById('surfaceColor');
let surfaceColorHover = document.getElementById('surfaceColorHover');
let defaultWhite = document.getElementById('defaultWhite');

primaryColor.addEventListener('change', (element) => {
    let color = element.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") + "--green: ' + color + ' !important;")'
            });
    });
    chrome.storage.sync.set({
        "primaryColor": color
    });
})

chrome.storage.sync.get("primaryColor", function (result) {
    primaryColor.setAttribute('value', result['primaryColor']);
});

secondaryColor.addEventListener('change', (element) => {
    let color = element.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") + "--orange: ' + color + ' !important;")'
            });
    });
    chrome.storage.sync.set({
        "secondaryColor": color
    });
});

chrome.storage.sync.get("secondaryColor", function (result) {
    secondaryColor.setAttribute('value', result['secondaryColor']);
});

tertiaryColor.addEventListener('change', (element) => {
    let color = element.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") + "--red: ' + color + ' !important;")'
            });
    });
    chrome.storage.sync.set({
        "tertiaryColor": color
    });
});

chrome.storage.sync.get("tertiaryColor", function (result) {
    tertiaryColor.setAttribute('value', result['tertiaryColor']);
});

backgroundColor.addEventListener('change', (element) => {
    let color = element.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") + "--gray-dark: ' + color + ' !important;")'
            });
    });
    chrome.storage.sync.set({
        "backgroundColor": color
    });
})

chrome.storage.sync.get("backgroundColor", function (result) {
    backgroundColor.setAttribute('value', result['backgroundColor']);
});

surfaceColor.addEventListener('change', (element) => {
    let color = element.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") + "--gray-light: ' + color + ' !important;")'
            });
    });
    chrome.storage.sync.set({
        "surfaceColor": color
    });
})

chrome.storage.sync.get("surfaceColor", function (result) {
    surfaceColor.setAttribute('value', result['surfaceColor']);
});

surfaceColorHover.addEventListener('change', (element) => {
    let color = element.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") + "--gray-light-hover: ' + color + ' !important;")'
            });
    });
    chrome.storage.sync.set({
        "surfaceColorHover": color
    });
})

chrome.storage.sync.get("surfaceColorHover", function (result) {
    surfaceColorHover.setAttribute('value', result['surfaceColorHover']);
});

defaultWhite.addEventListener('change', (element) => {
    let color = element.target.value;
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, {
                code: 'document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") + "--white: ' + color + ' !important;")'
            });
    });
    chrome.storage.sync.set({
        "defaultWhite": color
    });
})

chrome.storage.sync.get("defaultWhite", function (result) {
    defaultWhite.setAttribute('value', result['defaultWhite']);
});