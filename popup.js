const colorScheme = ["primaryColor","secondaryColor","tertiaryColor","backgroundColor","surfaceColor","surfaceColorHover","defaultWhite"]
const colorDefaults = ["#9FC0A2","#f5c276","#d36d6d","#2B343B","#3F474D","#4e565c","#F2F5F3"]

document.querySelector('#resetButton').addEventListener('click', () => {
    document.getElementById("list").reset();

    let scheme = null
    for(i = 0; i < colorScheme.length; i++){
        scheme = colorScheme[i]
        chrome.storage.sync.set({
            [scheme]: colorDefaults[i]
        });
    }

    tabScript('window.location.reload();')
})

colorScheme.forEach(scheme => addChangeListener(scheme));

function addChangeListener(scheme) {
    let schemeElement = document.getElementById(scheme);

    schemeElement.addEventListener('change', (element) =>{
        let color = element.target.value;
        let schemeCode = 'document.documentElement.setAttribute("style", document.documentElement.getAttribute("style") + "--'+ scheme +': ' + color + ' !important;")'

        tabScript(schemeCode);

        chrome.storage.sync.set({[scheme]: color});
    });
}

function tabScript(code){
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