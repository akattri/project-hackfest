# Archon

A homepage chrome extension that transforms your new tab page into a personalized dashboard. Manage bookmarks, organize tasks with Google Tasks integration, and stay on top of your schedule with Google Calendar sync.

<img width="1850" height="971" alt="image" src="https://github.com/user-attachments/assets/53c1a4df-5718-4946-b9ee-b7f826eb4e47" />


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
  
**No Tracking** - No analytics or user tracking.  
**Read-Only Context** - Limited permissions requested to Google services.  
**Secure OAuth** - Uses standard Google authentication flows.  

## Contributing

Found a bug or have a feature idea? Feel free to open an issue or submit a pull request!

## License

MIT License
