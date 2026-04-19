# Extension Deployment & Distribution Guide

## Quick Deployment (Choose Your Path)

### 🚀 Path 1: Load for Development (Fastest)

No build needed! Load directly from the folder:

1. Go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the project folder
5. Done! Your extension is now active

**Pros:** Instant, no build step, easy to modify
**Cons:** Developer mode shows, can't easily share

---

### 📦 Path 2: Create ZIP Package (Recommended)

Build a shareable ZIP file:

#### Using Bash Script (Easiest)
```bash
chmod +x build.sh
./build.sh
```

This creates `dist/hackfest-extension.zip`

#### Using NPM
```bash
npm install
npm run package
```

**To Install the ZIP:**
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Extract the ZIP somewhere
5. Select the extracted folder

**Pros:** Easy to share, clean, no special tools needed
**Cons:** Still requires developer mode

---

### 🔐 Path 3: Create CRX File (Professional)

Build a signed, distributable extension:

```bash
npm install
node scripts/create-crx.js
```

This creates `dist/hackfest-extension.crx`

**To Install the CRX:**

**Option A: Drag & Drop**
1. Go to `chrome://extensions/`
2. Drag `hackfest-extension.crx` onto the page
3. Confirm installation

**Option B: Command Line**
```bash
# Windows
start chrome "path\to\hackfest-extension.crx"

# Mac
open -a "Google Chrome" "path/to/hackfest-extension.crx"

# Linux
google-chrome "path/to/hackfest-extension.crx"
```

**Pros:** Professional, can be auto-updated, web installable
**Cons:** Requires signing key, more complex setup

---

## Installation Methods Comparison

| Method | Process | Type | Share | Auto-Update |
|--------|---------|------|-------|-------------|
| **Load Unpacked** | Folder → drop in extensions | Development | ❌ | N/A |
| **ZIP Package** | Extract → Load unpacked | Distribution | ✅ | ❌ |
| **CRX File** | Drag drop or command | Distribution | ✅ | ✅ |
| **Chrome Web Store** | Upload & approve | Commercial | ✅ | ✅ |

---

## Distribution Scenarios

### Scenario 1: Personal Use
```
→ Use "Load Unpacked" directly
→ No build needed
→ Focus on development, not distribution
```

### Scenario 2: Team/Small Group
```
→ Create ZIP file
→ Share via email or cloud storage
→ Team members extract and load
→ Easy to update (share new ZIP)
```

### Scenario 3: Public Distribution
```
→ Create CRX file with signing key
→ Host on website or GitHub releases
→ Users can drag & drop to install
→ Can auto-update by distributing new CRX
```

### Scenario 4: Enterprise Deployment
```
→ Use Google Workspace admin console
→ Deploy to entire organization
→ Force installation on managed devices
→ Centrally control updates
```

---

## Step-by-Step: From Code to Installed

### Development → Testing

```bash
# Just load directly
1. chrome://extensions/
2. Developer mode ON
3. Load unpacked (select folder)
4. Test features
```

### Testing → Sharing with Team

```bash
# Create shareable ZIP
bash build.sh
# Share dist/hackfest-extension.zip with team

# Team installs:
1. Extract ZIP
2. chrome://extensions/
3. Load unpacked (select extracted folder)
```

### Sharing → Public Release

```bash
# Create signed CRX
npm install
node scripts/create-crx.js

# Upload dist/hackfest-extension.crx to website
# Users can drag & drop to install
# SAVE dist/key.pem for future updates!
```

---

## File Descriptions

### Source Files (Edit These)
```
manifest.json          # Extension configuration
newtab.html           # Dashboard UI
newtab.js             # All functionality
styles.css            # Dashboard styling
background.js         # Service worker
popup.html            # Extension popup
icons/                # Extension icons
```

### Build Output Files (Don't Edit)
```
dist/hackfest-extension.zip     # For ZIP distribution
dist/hackfest-extension.crx     # For CRX distribution
dist/key.pem                    # Signing key (KEEP SAFE!)
```

---

## Updating an Installed Extension

### If Loaded Unpacked
1. Edit source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on Hackfest
4. Changes take effect immediately

### If Installed from ZIP/CRX
1. User keeps the ZIP/CRX file
2. You create a new build
3. User uninstalls old version
4. User installs new version

**For Auto-Updates:**
- Use CRX with proper signing
- Continue using same `key.pem`
- Users will auto-update

---

## Getting Help

### Extension Won't Load?
- Check manifest.json syntax
- Ensure all files exist
- Try refresh in chrome://extensions/

### CRX Creation Failed?
- Install Node.js: https://nodejs.org/
- Run: `npm install`
- Run: `node scripts/create-crx.js`
- Check error message

### Installation Won't Work?
- Use drag & drop for CRX
- Try `Load unpacked` for ZIP
- Check Chrome version (needs 95+)

---

## Next Steps

1. **For Testing:** `Load Unpacked` directly
2. **For Sharing:** `bash build.sh` then share ZIP
3. **For Distribution:** `npm install && node scripts/create-crx.js`
4. **For Update:** Keep your `key.pem` safe!

---

## Resources

- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store Publishing](https://developer.chrome.com/docs/webstore/)
- [CRX Format Documentation](https://github.com/oncletom/crx)
- [Google Workspace Admin](https://admin.google.com/)

Good luck! 🎉