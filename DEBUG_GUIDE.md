# 🔧 Task Adding Not Working - Debug Guide

Your extension now has **detailed error messages and console logging**. Here's how to debug the issue:

## 🚨 Quick Fixes to Try

### 1. **Check Your Google Setup**
```bash
It doesn't register when you add a task means:
- ✗ Token might not be shared properly
- ✗ Google API not enabled
- ✗ Client ID not set in manifest.json
```

**Solution:** 
1. Open `manifest.json`
2. Find: `"client_id": "YOUR_GOOGLE_CLIENT_ID"`
3. Replace with your actual Client ID from Google Cloud Console
4. Save and reload extension in chrome://extensions/

### 2. **Verify Google APIs are Enabled**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click your project name
3. Search for "Google Tasks API" → Click it → Click "ENABLE"
4. Search for "Google Calendar API" → Click it → Click "ENABLE"

### 3. **Clear Extension Data & Sign In Again**
1. Go to `chrome://extensions/`
2. Find "Hackfest" → Click "Details"
3. Click "Clear data"
4. Back on new tab, click "Sign in with Google"

---

## 🔍 **How to Debug - Open DevTools**

### Step 1: Open Developer Console
1. Open a new tab with your extension
2. Press **F12** (or Cmd+Option+I on Mac)
3. Click the **"Console"** tab

### Step 2: Look for Messages
You'll see messages like:
```
✓ Authentication successful. Token: ABC123...
✓ Token found: ABC123...
Checking authentication status...
Loading tasks...
```

### Step 3: Try Adding a Task
1. Look at Console while you add a task
2. You'll see detailed messages like:

**Success:**
```
Task added successfully: {id: '123', title: 'My Task'}
Tasks data: {items: [...]}
```

**Error:**
```
Error adding task: No task lists found
Tasklists data: {items: []}
Failed to add task: No task lists found
```

---

## 🐛 **Common Issues & Fixes**

### Issue 1: "Please sign in with Google first"
**Cause:** Token is null, not signed in
**Fix:**
1. Click "Sign in with Google" button
2. Check console for "✓ Authentication successful"
3. Try adding task again

### Issue 2: "No task lists found"
**Cause:** Google Tasks API not enabled or no task list created
**Fix:**
1. Go to [Google Tasks](https://tasks.google.com)
2. Create at least one task list
3. Back to extension, click "↻ Sync" button
4. Try adding task again

### Issue 3: "Access denied. Make sure Google Tasks and Calendar APIs are enabled"
**Cause:** APIs not enabled in Google Cloud
**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to APIs & Services > Library
3. Search for "Google Tasks API" and enable
4. Search for "Google Calendar API" and enable
5. Wait 30 seconds
6. Reload extension and try again

### Issue 4: "API error: 401"
**Cause:** Token expired or invalid
**Fix:**
1. Go to chrome://extensions/
2. Find Hackfest > Details > Clear data
3. Click "Sign in with Google" again
4. Try adding task

### Issue 5: In Console: "client_id is missing/invalid"
**Cause:** manifest.json not properly configured
**Fix:**
1. Open manifest.json
2. Check: `"oauth2": {"client_id": "..."}`
3. Paste your real Client ID (not "YOUR_GOOGLE_CLIENT_ID")
4. Save and reload extension

---

## 📊 **Full Debug Checklist**

Go through each step and check console:

```
Website: new tab page
Press: F12 to open DevTools
Go to: Console tab

[ ] Can you see "Checking authentication status..." message?
    - If YES: Extension is loading correctly
    - If NO: Check that manifest.json is correct

[ ] After clicking "Sign in with Google", do you see success message?
    - If YES: Copy the token ID shown
    - If NO: Check Google Cloud API setup

[ ] Does console show "Loading tasks..."?
    - If YES: Token is working
    - If NO: Sign in again

[ ] When you try to add a task, do you see "Adding..." then error?
    - If YES: Read the error message carefully
    - If NO: Check browser console for JavaScript errors

[ ] Do you see "Tasklists data: {items: [...]}"?
    - If YES and empty: Create task list in Google Tasks first
    - If YES with items: Good, continue

[ ] Do you see "Task added successfully"?
    - If YES: Success! Refresh to see task
    - If NO: Check error message above it
```

---

## 🔐 **Check Your Client ID Setup**

### Verify in manifest.json
```json
{
  "oauth2": {
    "client_id": "123456789-abcdef123456.apps.googleusercontent.com",
    "scopes": [
      "https://www.googleapis.com/auth/tasks",
      "https://www.googleapis.com/auth/calendar.readonly"
    ]
  }
}
```

✅ Should look like: `123456789-abcdef123456.apps.googleusercontent.com`
❌ Should NOT look like: `YOUR_GOOGLE_CLIENT_ID`

### How to Get Your Real Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (drop-down at top)
3. Go to "APIs & Services" > "Credentials"
4. Find "OAuth 2.0 Client IDs" section
5. Look for your web app credential
6. Copy the "Client ID" value
7. Paste into manifest.json

---

## 🖥️ **Console Messages Explained**

### Authentication Messages
```
✓ Token found: ABC123...
→ Extension found your saved token, ready to use

✓ Authentication successful. Token: ABC123...
→ You successfully signed in

No token found. User needs to sign in.
→ Need to click "Sign in with Google"

Authentication failed
→ Something went wrong with Google sign-in
```

### Task Action Messages
```
Checking authentication status...
→ Extension starting up

Loading tasks...
Adding...
Task lists response: 200
→ API call successful (200 = OK)

Tasklists data: {items: []}
→ No task lists in Google Tasks

No task lists found
→ Create a task list in Google Tasks first

Task added successfully: {id: '123', title: '...'}
→ Task was created! Check Google Tasks to verify
```

### Error Messages
```
Error: "No task lists found"
→ Go to Google Tasks and create one

Error: "Access denied. Make sure Google Tasks and Calendar APIs are enabled"
→ Enable APIs in Google Cloud Console

Error: "401 Unauthorized"
→ Sign out and sign in again

Error: "403 Forbidden"
→ Check API permissions and credentials
```

---

## 📝 **If You're Still Stuck**

### Collect These Details
1. **Screenshot of the error** - Press F12, go to Console, take screenshot
2. **manifest.json** - Show the oauth2 section
3. **Google Cloud setup** - 
   - Are Google Tasks API enabled? (Yes/No)
   - Are Google Calendar API enabled? (Yes/No)
   - Is your Client ID correct? (Yes/No)

### Send Debug Info
When asking for help, include:
```
Extension Version: 1.0
Chrome Version: [check chrome://version/]
Error Message: [exact error from console]
Steps to reproduce:
1. ...
2. ...
3. ...
Console output: [screenshot or text]
```

---

## ✅ **Success Indicators**

When working correctly, you should see:

1. **In Console:**
   ```
   ✓ Token found: ABC123...
   Tasklists data: {items: [{id: '...', title: 'My Tasks'}]}
   Task added successfully: {id: '123', title: 'My Task'}
   ```

2. **In Extension:**
   - "✓ Signed In" button shows
   - Tasks section shows your tasks
   - Calendar section shows events
   - Can add new tasks

3. **In Google Tasks:**
   - New task appears in your list
   - Syncs automatically

---

## 🆘 **Emergency Reset**

If everything is broken, try this:

```bash
1. Go to chrome://extensions/
2. Find "Hackfest" → Click "Details"
3. Click "Clear data" button
4. Reload extension (click refresh icon)
5. Go back to new tab
6. F12 and check console for "Checking authentication status..."
7. Click "Sign in with Google"
8. Try adding task again
```

---

**Questions? Check the console messages first - they now tell you exactly what's wrong!** 🎯