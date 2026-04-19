// background.js - Service worker for Hackfest extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({ url: 'chrome://newtab' });
    }
});

// Invalidate token when user signs out
chrome.identity.onSignInChanged.addListener((account, signedIn) => {
    if (!signedIn) {
        chrome.storage.local.remove('hackfest_token');
    }
});