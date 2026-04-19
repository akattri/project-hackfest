# Google API Setup Guide

This guide will walk you through setting up the Google API credentials needed for the Hackfest extension.

## Prerequisites
- Google Account
- Chrome Browser (or any other chromium based browser - preffered)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter "Hackfest Extension" as the project name
5. Click "CREATE"

## Step 2: Enable Required APIs

1. Go to the [APIs & Services > Library](https://console.cloud.google.com/apis/library)
2. Search for "Google Tasks API"
3. Click on it and click "ENABLE"
4. Go back to the library and search for "Google Calendar API"
5. Click on it and click "ENABLE"

## Step 3: Create OAuth 2.0 Credentials

1. Go to [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "+ CREATE CREDENTIALS" at the top
3. Select "OAuth client ID"
4. If prompted, first configure the OAuth consent screen:
   - Select "External"
   - Fill in the required information
   - Add your email to test users
   - Save
5. Back to credentials, select "Web application"
6. Give it a name like "Hackfest Extension"

## Step 4: Configure Authorized Origins

1. Under "Authorized JavaScript origins", add:
   - `http://localhost` (for testing)
   - `chrome-extension://*` (for any extension)

2. Under "Authorized redirect URIs", add:
   - `https://www.googleapis.com/oauth2callback`

3. Click "CREATE"

## Step 5: Copy Your Client ID

1. In the credentials list, find your new OAuth 2.0 Client ID
2. Click on it to view details
3. Copy the "Client ID" value

## Step 6: Update the Extension

1. Open `manifest.json` in the extension folder
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your copied Client ID
3. Example:
```json
"oauth2": {
    "client_id": "123456789-abc123.apps.googleusercontent.com",
    "scopes": [
      "https://www.googleapis.com/auth/tasks",
      "https://www.googleapis.com/auth/calendar.readonly"
    ]
}
```

## Step 7: Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right corner)
3. Click "Load unpacked"
4. Navigate to the `/workspaces/project-hackfest` folder
5. Select it and click "Select Folder"

The extension should now appear in your extensions list!

## Step 8: Test the Extension

1. Open a new tab (Ctrl+T or Cmd+T)
2. You should see your custom Hackfest landing page
3. Click "Sign in with Google"
4. Grant the necessary permissions
5. Your bookmarks, tasks, and calendar should now appear

## Troubleshooting

### "Authorization Failed" Error
- Make sure you've updated the Client ID in `manifest.json`
- Verify the OAuth consent screen is configured
- Check that the APIs are enabled in Google Cloud Console

### No tasks or events showing
- Make sure you have tasks in Google Tasks or events in Google Calendar
- Try clicking the "↻ Sync" buttons to refresh

### Extension won't load
- Check that the manifest.json is valid JSON (use a JSON validator)
- Make sure all file paths in manifest.json are correct
- Try disabling and re-enabling the extension

## Need Help?

Check the [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
Check the [Google APIs Documentation](https://developers.google.com/apis-explorer)