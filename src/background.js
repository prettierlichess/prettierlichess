chrome.runtime.onInstalled.addListener(function () {
	// If declarativeContent exists (Chrome), keep existing behavior.
	if (chrome.declarativeContent && chrome.declarativeContent.onPageChanged) {
		chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
			chrome.declarativeContent.onPageChanged.addRules([
				{
					conditions: [
						new chrome.declarativeContent.PageStateMatcher({
							pageUrl: {
								hostEquals: 'lichess.org',
							},
						}),
					],
					actions: [new chrome.declarativeContent.ShowPageAction()],
				},
			]);
		});
		return;
	}

	// Fallback (Firefox/Gecko): emulate the same result using pageAction.
	function updatePageActionForTab(tab) {
		if (!tab || !tab.id) return;
		const url = tab.url || '';
		if (url.indexOf('://lichess.org/') !== -1 || url.indexOf('://www.lichess.org/') !== -1) {
			if (chrome.pageAction && chrome.pageAction.show) chrome.pageAction.show(tab.id);
		} else {
			if (chrome.pageAction && chrome.pageAction.hide) chrome.pageAction.hide(tab.id);
		}
	}

	// Update all existing tabs on install
	if (chrome.tabs && chrome.tabs.query) {
		chrome.tabs.query({}, function (tabs) {
			for (var i = 0; i < tabs.length; i++) {
				updatePageActionForTab(tabs[i]);
			}
		});
	}

	// Update when a tab is updated
	if (chrome.tabs && chrome.tabs.onUpdated) {
		chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
			if (changeInfo.status === 'complete' || changeInfo.url) {
				updatePageActionForTab(tab);
			}
		});
	}

	// Update when the active tab changes
	if (chrome.tabs && chrome.tabs.onActivated && chrome.tabs.get) {
		chrome.tabs.onActivated.addListener(function (activeInfo) {
			chrome.tabs.get(activeInfo.tabId, function (tab) {
				updatePageActionForTab(tab);
			});
		});
	}
});
