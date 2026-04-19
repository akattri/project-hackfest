# Installation & Usage Guide

## Quick Start

### 1. Set Up Google API Credentials (15 minutes)

Follow the detailed guide in [GOOGLE_SETUP.md](GOOGLE_SETUP.md) to:
- Create a Google Cloud Project
- Enable Google Tasks and Calendar APIs
- Create OAuth 2.0 credentials
- Add your Client ID to `manifest.json`

### 2. Add Extension Icons

The extension needs three icon files (you can use any 16x16, 48x48, and 128x128 PNG images):
- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`

If you don't have custom icons, you can use placeholder images.

### 3. Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the project folder
5. The extension should appear in your extension list

### 4. Test It Out

1. Open a new tab
2. Click "Sign in with Google"
3. Grant the requested permissions
4. Explore your bookmarks, tasks, and calendar!

## Features

### 📑 Bookmarks
- View all your Chrome bookmarks
- Add new bookmarks directly from the dashboard
- Delete bookmarks with one click
- Quick access to all your favorite sites

### ✓ Tasks
- Sync with Google Tasks (Google Todo)
- View all your tasks
- Create new tasks from the dashboard
- Refresh tasks with the sync button

### 📅 Calendar
- See upcoming events from Google Calendar
- View events for the next 30 days
- Shows date and time for each event
- Refresh calendar with the sync button

## Usage Tips

- **Keyboard Shortcut**: Use Ctrl+T (or Cmd+T on Mac) to open a new tab and see your dashboard
- **Sync Data**: Use the "↻ Sync" buttons to manually refresh tasks and calendar
- **Add Bookmarks**: Click "+ Add" next to Bookmarks to quickly save the current page or any URL
- **Quick Tasks**: Press Enter in the task input field to add a task
- **Sign Out**: Refresh the page and click "Sign in with Google" again if you need to re-authenticate

## Troubleshooting

### Extension Won't Load
1. Check that `manifest.json` is valid JSON
2. Verify all file names are correct
3. Try reloading the extension from `chrome://extensions/`

### Sign In Doesn't Work
1. Make sure you've set up Google API credentials
2. Verify the Client ID is correct in `manifest.json`
3. Check that APIs are enabled in Google Cloud Console

### No Data Showing
1. Make sure you're signed in
2. Click the "↻ Sync" buttons to refresh
3. Check that you have bookmarks/tasks/events to display
4. Open Chrome DevTools (F12) to check for errors in the Console

### Getting Errors?
1. Press F12 to open Developer Tools
2. Go to the "Console" tab
3. Check for any error messages
4. Take a screenshot and share it if you need help

## Development

### File Structure
```
project-hackfest/
├── manifest.json           # Extension configuration
├── newtab.html            # Dashboard HTML
├── newtab.js              # Main dashboard logic
├── styles.css             # Dashboard styling
├── background.js          # Service worker
├── popup.html             # Extension popup
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── GOOGLE_SETUP.md        # Google API setup guide
├── INSTALLATION.md        # This file
└── README.md              # Project overview
```

### Modifying the Dashboard

- **HTML**: Edit `newtab.html` to change the layout
- **Styling**: Edit `styles.css` to customize appearance
- **Functionality**: Edit `newtab.js` to add new features

### Testing Changes

1. Make your changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Hackfest Extension
4. Open a new tab to see your changes

## Security & Privacy

- Your Google authentication token is stored locally
- The extension only requests read access to tasks and calendar
- No data is sent to external servers except to Google
- Your bookmarks are managed locally by Chrome

## Support

For detailed information about:
- Setting up Google APIs: See [GOOGLE_SETUP.md](GOOGLE_SETUP.md)
- Extension development: Visit [developers.google.com](https://developers.google.com)
- Google APIs: Visit [googleapis.com](https://googleapis.com)