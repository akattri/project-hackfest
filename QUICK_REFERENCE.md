# Quick Reference Card

## 📋 Checklist Before Loading Extension

- [ ] Google API credentials created
- [ ] Client ID added to `manifest.json`
- [ ] Icon files added to `icons/` folder (16x16, 48x48, 128x128 PNG)
- [ ] All files present in project folder

## 🚀 Quick Commands

### Load Extension
```
1. Go to chrome://extensions/
2. Enable Developer mode
3. Click "Load unpacked"
4. Select project folder
```

### Test Extension
```
1. Press Ctrl+T to open new tab (or Cmd+T on Mac)
2. See the Hackfest dashboard
3. Click "Sign in with Google"
4. Test features
```

### Reload After Changes
```
1. Make changes to files
2. Go to chrome://extensions/
3. Click refresh icon on extension
4. Open new tab to see changes
```

## 📂 File Guide

| File | Purpose |
|------|---------|
| `manifest.json` | Extension config & permissions |
| `newtab.html` | Dashboard layout |
| `newtab.js` | All functionality & API calls |
| `styles.css` | Dashboard styling |
| `background.js` | Authentication handling |
| `popup.html` | Extension icon popup |
| `icons/` | Extension icons (3 sizes) |

## 🔑 Key Settings

**In manifest.json:**
```json
"oauth2": {
    "client_id": "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com"
}
```

**Scopes used:**
- `https://www.googleapis.com/auth/tasks`
- `https://www.googleapis.com/auth/calendar.readonly`

## 🆘 Common Fixes

| Problem | Solution |
|---------|----------|
| Extension won't load | Check manifest.json syntax, reload extension |
| Sign in fails | Verify Client ID in manifest.json |
| No data shows | Click "↻ Sync" buttons, check you're signed in |
| Errors in console | Press F12, check Console tab for error messages |

## 📖 Documentation

- **Full Setup**: See `INSTALLATION.md`
- **Google API Setup**: See `GOOGLE_SETUP.md`
- **Overview**: See `README.md`

## 💡 Tips

✅ Use Ctrl+T to quickly access dashboard
✅ Click "↻ Sync" to manually refresh data
✅ Press Enter to add tasks quickly
✅ Bookmark management is instant (no sync needed)
✅ Use F12 DevTools to debug issues

---
Need help? Check the documentation files!