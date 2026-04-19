// Background script for Hackfest extension

// Handle authentication
function authenticate() {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, function(token) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(token);
            }
        });
    });
}

// Export for use in other scripts
window.authenticate = authenticate;