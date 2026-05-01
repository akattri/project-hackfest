# Archon

A homepage chrome extension that transforms your new tab page into a personalized dashboard. Manage bookmarks, organize tasks with Google Tasks integration, and stay on top of your schedule with Google Calendar sync.

<img width="1860" height="980" alt="image" src="https://github.com/user-attachments/assets/3641c566-3dcc-4578-8097-e691c0fed692" />

## Features

### Smart Bookmarks
- View all your Chrome bookmarks in one place
- Quick add bookmarks directly from the dashboard
- Delete bookmarks with one click
- Organized and easy to navigate

### Google Tasks Integration
- Sync with your Google Tasks
- Create new tasks from the dashboard
- View all your tasks at a glance
- One-click refresh to stay in sync

### Google Calendar Sync
- Display upcoming events for the next 30 days
- See event dates and times
- Stay on top of your schedule
- One-click calendar refresh

### Beautiful Interface
- Modern, responsive design conforming to Apple Human Interface Guidelines
- Smooth animations and transitions
- Works perfectly on desktop and mobile-sized windows
- Full dark mode support

## Installation

### Load Unpacked (Development)
1. Clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** in the top right corner.
4. Click **Load unpacked** and select the directory containing this project.
5. Open a new tab to see your new dashboard!

## Setup Google APIs

To use the Google Tasks and Calendar integrations, you need to provide your own Google OAuth 2.0 Client ID:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the **Google Tasks API** and **Google Calendar API**.
3. Go to **Credentials**, create an **OAuth client ID** (Application type: Chrome app).
4. For the Application ID, use your Chrome extension ID.
5. Copy the generated Client ID and place it in your `manifest.json` under `oauth2.client_id`.

## Building & Packaging

If you want to package the extension for distribution:
```bash
# Create a zip archive for the Chrome Web Store
bash build.sh
```
Or create a signed CRX:
```bash
npm install
node scripts/create-crx.js
```

## Security & Privacy

✅ **Local Storage** - All data is stored locally on your device.
✅ **No Tracking** - No analytics or user tracking.
✅ **Read-Only Context** - Limited permissions requested to Google services.
✅ **Secure OAuth** - Uses standard Google authentication flows.

## Contributing

Found a bug or have a feature idea? Feel free to open an issue or submit a pull request!

## License

MIT License
