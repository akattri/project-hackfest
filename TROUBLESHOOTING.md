# Troubleshooting Guide

## Extension Won't Load

### Error: "Icon at '120x120' size could not be decoded"

**Solution:**
- Ensure icons folder contains valid PNG files
- File names must be: `icon16.png`, `icon48.png`, `icon128.png`
- Icons must be valid image files (not text placeholders)

### Error: "Invalid manifest"

**Solution:**
1. Check `manifest.json` is valid JSON
2. Open it in VS Code and check for syntax errors
3. Use an online JSON validator
4. Verify all required fields are present

### Extension not appearing in chrome://extensions/

**Solution:**
1. Go to `chrome://extensions/`
2. Refresh the page
3. Try loading unpacked again
4. Check console for error messages

## Sign In Issues

### Error: "Authentication failed"

**Causes & Solutions:**

1. **Missing Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google Tasks and Calendar APIs

2. **Wrong Client ID**
   - Copy Client ID from Google Cloud Console
   - Paste into `manifest.json` exactly as shown
   - Reload extension after changing manifest

3. **Missing redirect URI**
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Edit the OAuth 2.0 Client ID
   - Add `https://www.googleapis.com/oauth2callback` to redirect URIs

4. **APIs not enabled**
   - Go to [APIs & Services > Library](https://console.cloud.google.com/apis/library)
   - Search for "Google Tasks API" and enable it
   - Search for "Google Calendar API" and enable it

### Sign in works but nothing loads

**Solution:**
1. Check you're signed in (button should show "✓ Signed In")
2. Click the "↻ Sync" buttons to refresh data
3. Open F12 DevTools and check Console for errors
4. Create a Google Task or Calendar event if you don't have any

## No Data Showing

### Bookmarks section is empty

**Causes & Solutions:**
1. You may not have any bookmarks
   - Add bookmarks by clicking "+ Add" button
   - Or bookmark a website using Ctrl+D

2. Browser bookmarks are located in system
   - Check chrome://bookmarks/ to see existing bookmarks
   - If empty there, bookmark a page first

### Tasks section says "Sign in to see tasks"

**Solution:**
1. Click "Sign in with Google"
2. Grant permission for Google Tasks when prompted
3. If already signed in, try refreshing with "↻ Sync" button
4. Go to [Google Tasks](https://tasks.google.com) and create a task

### Calendar section shows no events

**Solution:**
1. Sign in first if not already signed
2. Go to [Google Calendar](https://calendar.google.com) and create an event
3. Make sure event is in the next 30 days
4. Click "↻ Sync" to refresh

## Display Issues

### Dashboard looks broken or cut off

**Solution:**
1. Refresh the page (F5)
2. Check that `styles.css` is in the project folder
3. Open F12 DevTools and check if CSS is loading
4. Try different screen resolution

### Text is too small or too large

**Solution:**
1. Zoom in/out with Ctrl/Cmd + Plus/Minus
2. Right-click > "Inspect" to check CSS
3. Modify `styles.css` font sizes if needed

## Performance Issues

### Dashboard is slow to load

**Causes & Solutions:**

1. **Heavy bookmarks collection**
   - Remove unused bookmarks
   - Click "Load unpacked" refresh in extensions page

2. **Too many calendar events**
   - Archive old calendar events
   - The extension only shows next 30 days

3. **Network connectivity**
   - Check your internet connection
   - Try again in a few seconds

### Sync buttons don't work

**Solution:**
1. Check internet connection
2. Make sure you're still signed in
3. Open DevTools (F12) Console tab
4. Check for error messages
5. Try signing out and back in

## Advanced Debugging

### Open Developer Tools
```
Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
```

### Check Console for Errors
1. Go to new tab
2. Press F12
3. Click "Console" tab
4. Look for red error messages
5. Screenshot the error if reporting

### Check Network Requests
1. Press F12
2. Click "Network" tab
3. Perform action (add task, sign in, etc.)
4. Look for failed requests (red lines)
5. Click on failed request to see error details

### Clear Extension Data
```
Go to chrome://extensions/
Click "Details" on Hackfest
Click "Clear data"
Refresh the extension
```

## API Quota Issues

### Getting "Quota exceeded" errors

**Solution:**
1. These are temporary from Google
2. Wait 5-10 minutes and try again
3. Google has daily usage limits for free tier
4. If persistent, check usage in Google Cloud Console

## Still Having Issues?

### Helpful Info to Collect

1. The exact error message (screenshot)
2. What you were trying to do when error occurred
3. Console errors (press F12 > Console)
4. Your Chrome version (Chrome menu > About Chrome)
5. Steps you've already tried

### Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Google APIs Documentation](https://developers.google.com/apis-explorer)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Tasks Help](https://support.google.com/tasks/)
- [Google Calendar Help](https://support.google.com/calendar/)

---

If you've tried all steps and still have issues, detailed error messages from the Console tab (F12) will help diagnose the problem.