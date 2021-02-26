chrome.storage.sync.get("primaryColor", function (result) {
    document.documentElement.setAttribute("style", "--green: " + result["primaryColor"] + " !important;");
    console.log(result["primaryColor"]);
});

chrome.storage.sync.get("secondaryColor", function (result) {
    document.documentElement.setAttribute("style", document.documentElement.getAttribute('style') + "--orange: " + result["secondaryColor"] + " !important;");
});

chrome.storage.sync.get("tertiaryColor", function (result) {
    document.documentElement.setAttribute("style", document.documentElement.getAttribute('style') + "--red: " + result["tertiaryColor"] + " !important;");
});

chrome.storage.sync.get("backgroundColor", function (result) {
    document.documentElement.setAttribute("style", document.documentElement.getAttribute('style') + "--gray-dark: " + result["backgroundColor"] + " !important;");
});

chrome.storage.sync.get("surfaceColor", function (result) {
    document.documentElement.setAttribute("style", document.documentElement.getAttribute('style') + "--gray-light: " + result["surfaceColor"] + " !important;");
});

chrome.storage.sync.get("surfaceColorHover", function (result) {
    document.documentElement.setAttribute("style", document.documentElement.getAttribute('style') + "--gray-light-hover: " + result["surfaceColorHover"] + " !important;");
});

chrome.storage.sync.get("defaultWhite", function (result) {
    document.documentElement.setAttribute("style", document.documentElement.getAttribute('style') + "--white: " + result["defaultWhite"] + " !important;");
});