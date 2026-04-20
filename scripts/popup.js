document.getElementById('open-dashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'chrome://newtab' });
});
