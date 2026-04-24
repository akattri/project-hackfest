# Archon

A homepage chrome extension that transforms your new tab page into a personalized dashboard. Manage bookmarks, organize tasks with Google Todo integration, and stay on top of your schedule with Google Calendar sync.

<img width="1860" height="980" alt="image" src="https://github.com/user-attachments/assets/3641c566-3dcc-4578-8097-e691c0fed692" />




## Features

### Smart Bookmarks
- View all your Chrome bookmarks in one place
- Quick add bookmarks directly from the dashboard
- Delete bookmarks with one click
- Organized and easy to navigate

### Google Tasks Integration (Beta)
- Sync with your Google Tasks (Google Todo)
- Create new tasks from the dashboard
- View all your tasks at a glance
- One-click refresh to stay in sync

### Google Calendar Sync (Beta)
- Display upcoming events for the next 30 days
- See event dates and times
- Stay on top of your schedule
- One-click calendar refresh

### Beautiful Interface
- Modern, responsive design
- Dark gradient background
- Smooth animations and transitions
- Works on desktop and mobile-sized windows

## Quick Start

### Load Extension (Choose One)

**Easiest - Load Directly:**
```bash
1. Go to chrome://extensions/
2. Enable Developer Mode
3. Click "Load unpacked" → Select this folder
4. Done!
```

**For Sharing - Create ZIP:**
```bash
bash build.sh
# Creates dist/hackfest-extension.zip
```

**For Distribution - Create CRX:**
```bash
npm install
node scripts/create-crx.js
# Creates dist/hackfest-extension.crx
```

## Detailed Setup & Deployment

See [INSTALLATION.md](INSTALLATION.md) for complete setup instructions and troubleshooting.


## Project Structure

```
.
├── manifest.json          # Extension configuration
├── newtab.html           # Main dashboard page
├── newtab.js             # Dashboard logic & API integration
├── styles.css            # Beautiful styling
├── background.js         # Service worker for authentication
├── popup.html            # Extension popup interface
├── icons/                # Extension icons (16, 48, 128px)
├── README.md             # This file
├── INSTALLATION.md       # Detailed setup guide
└── GOOGLE_SETUP.md       # Google API configuration guide
```

## Permissions

The extension requires these permissions:
- `bookmarks` - To display and manage bookmarks
- `identity` - For Google OAuth authentication
- `storage` - To store authentication tokens
- `https://www.googleapis.com/*` - To access Google APIs

## Development

### Testing changes:
1. Edit files
2. Go to `chrome://extensions/`
3. Click the refresh icon
4. Open a new tab

## Security & Privacy

✅ **Local Storage** - All data stored locally on your device
✅ **No Tracking** - No analytics or tracking
✅ **Read-Only** - Limited permissions to Google services
✅ **Secure OAuth** - Standard Google authentication
✅ **Open Source** - Fully transparent code

## Documentation

| Guide | Purpose |
|-------|---------|
| **[INSTALLATION.md](INSTALLATION.md)** | Complete setup instructions |
| **[GOOGLE_SETUP.md](GOOGLE_SETUP.md)** | Google API credential setup |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Build & deployment methods |
| **[BUILD_CRX.md](BUILD_CRX.md)** | Creating distributable CRX files |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Quick commands & checklists |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Common issues & solutions |

## Building & Packaging

### For Personal Use
```bash
# Just load directly (no build needed)
chrome://extensions/ → Load unpacked → Select folder
```

### For Sharing
```bash
bash build.sh
# Creates dist/hackfest-extension.zip
```

### For Distribution
```bash
npm install
node scripts/create-crx.js
# Creates dist/hackfest-extension.crx (ready to distribute)
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full details on all distribution methods.

## Troubleshooting

### Common Issues:

**Extension won't load?**
- Validate `manifest.json` is valid JSON
- Check all file paths are correct
- Try reloading the extension

**Sign in fails?**
- Verify Client ID in `manifest.json`
- Check Google APIs are enabled
- See [GOOGLE_SETUP.md](GOOGLE_SETUP.md)

**No data showing?**
- Click "↻ Sync" buttons to refresh
- Sign out and sign in again
- Check F12 console for errors

**Build script errors?**
- See [BUILD_CRX.md](BUILD_CRX.md) troubleshooting
- Check that Node.js is installed (for npm builds)

**Getting errors?**
- Press F12 to open DevTools
- Check the Console tab for error messages
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed help

## Future Enhancements

Possible features for future versions:
- Weather widget
- Notes section
- Search functionality
- Customizable dashboard layout
- Todo list filtering
- Event details on hover
- Dark/Light theme toggle

## Support

-  See [INSTALLATION.md](INSTALLATION.md) for detailed setup
-  See [GOOGLE_SETUP.md](GOOGLE_SETUP.md) for API configuration
-  Check F12 DevTools Console for errors
-  Visit [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)

## Contributing

Found a bug? Have a feature idea? Feel free to open an issue or submit a pull request!
