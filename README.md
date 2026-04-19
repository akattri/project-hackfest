# Hackfest Landing Page Extension

A Chrome extension that provides a custom new tab landing page with bookmarks management, Google Todo integration, and Google Calendar sync.

## Features

- **Bookmarks Management**: View and add bookmarks directly from the new tab page
- **Google Todo Integration**: Sync with Google Tasks to manage your to-do list
- **Google Calendar Sync**: Display upcoming calendar events

## Setup

1. Clone this repository
2. Go to [Google Cloud Console](https://console.cloud.google.com/)
3. Create a new project or select an existing one
4. Enable the Google Tasks API and Google Calendar API
5. Create OAuth 2.0 credentials (Web application type)
6. Add your domain to authorized origins (for development, use `chrome-extension://` with your extension ID)
7. Copy the Client ID
8. In `manifest.json`, replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID
9. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project folder

## Icons

Add the following icon files to the `icons/` folder:
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

## Permissions

The extension requires the following permissions:
- `bookmarks`: To manage browser bookmarks
- `identity`: For Google OAuth authentication
- `https://www.googleapis.com/*`: To access Google APIs

## Development

- `manifest.json`: Extension manifest
- `newtab.html`: The new tab page HTML
- `newtab.js`: Main JavaScript logic
- `styles.css`: Styling for the landing page
- `background.js`: Background service worker for authentication