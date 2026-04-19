# Building & Packaging the Hackfest Extension

This guide walks you through compiling the extension into installable formats (.zip and .crx).

## Prerequisites

- Node.js 14+ and npm installed
- The extension folder with all files

## Quick Build (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Icons & Create ZIP
```bash
npm run build
npm run package
```

This will:
- Create placeholder icons in `icons/` folder
- Generate `dist/hackfest-extension.zip`

### 3. Install the ZIP

**Option A: Load Unpacked (Developer Mode)**
```
1. Go to chrome://extensions/
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the project folder
```

**Option B: Extract ZIP and Load**
```
1. Go to chrome://extensions/
2. Extract hackfest-extension.zip somewhere
3. Click "Load unpacked"
4. Select the extracted folder
```

---

## Creating a CRX File (for distribution)

CRX is Chrome's native extension format. It requires signing with a private key.

### 1. Generate CRX File
```bash
npm install
npm run build
node scripts/create-crx.js
```

This will:
- Generate a `dist/key.pem` private signing key
- Create `dist/hackfest-extension.crx`

### 2. Save Your Key!

**⚠️ IMPORTANT:**
The `dist/key.pem` file is your extension's private key. Keep it safe!

```bash
# Save to a secure location
cp dist/key.pem ~/secure-backups/hackfest-key.pem

# Update .gitignore to never commit it
echo "dist/key.pem" >> .gitignore
```

### 3. Install the CRX

**Option A: Drag & Drop**
```
1. Go to chrome://extensions/
2. Drag the .crx file onto the page
3. Click "Add extension"
```

**Option B: Command Line (Windows)**
```powershell
# Or use the appropriate path for your browser
"C:\Program Files\Google\Chrome\Application\chrome.exe" "path\to\hackfest-extension.crx"
```

**Option C: Command Line (Mac)**
```bash
open -a "Google Chrome" "path/to/hackfest-extension.crx"
```

**Option D: Command Line (Linux)**
```bash
google-chrome "path/to/hackfest-extension.crx"
```

---

## File Outputs

### After `npm run build`
```
dist/
└── (empty, ready for packaging)
icons/
├── icon16.png
├── icon48.png
└── icon128.png
```

### After `npm run package`
```
dist/
└── hackfest-extension.zip    # Ready to load as unpacked
```

### After `node scripts/create-crx.js`
```
dist/
├── hackfest-extension.crx    # Ready to distribute
├── key.pem                   # KEEP SAFE! Your signing key
└── hackfest-extension.zip
```

---

## Custom Icons

The build creates placeholder 1x1 PNG icons. For better visuals:

### Replace Icons with Custom Images

1. Create or find PNG images:
   - `icon16.png` (16×16 pixels)
   - `icon48.png` (48×48 pixels)
   - `icon128.png` (128×128 pixels)

2. Place them in the `icons/` folder

3. Rebuild:
   ```bash
   npm run build
   npm run package
   ```

### Create Icons Online

Free icon creation tools:
- [Favicon Generator](https://favicon-generator.org/)
- [Canva](https://www.canva.com/)
- [GIMP](https://www.gimp.org/) (free, open-source)

---

## Publishing to Chrome Web Store

To publish on the Chrome Web Store:

1. Create a [Google Play developer account](https://play.google.com/console) ($5 one-time fee)

2. Upload your extension:
   - Go to Chrome Web Store Developer Dashboard
   - Click "New Item"
   - Upload `dist/hackfest-extension.zip`
   - Fill in store listing details
   - Submit for review

3. Once approved, users can install from the Chrome Web Store

---

## Troubleshooting Build Issues

### Error: Cannot find module 'archiver'
```bash
npm install archiver
```

### Error: Cannot find module 'crx'
```bash
npm install crx
```

### Missing icon files
```bash
npm run build
```

### CRX generation fails
1. Make sure Node.js is installed: `node --version`
2. Try again: `node scripts/create-crx.js`
3. Check that all extension files exist

### Icon files won't display
- Replace placeholder icons with real PNG files
- Ensure file names exactly match: `icon16.png`, `icon48.png`, `icon128.png`
- Verify they're valid PNG files

---

## Distribution Methods

### Method 1: Direct CRX Distribution
```
✓ Share hackfest-extension.crx
✓ Users can drag & drop to install
✓ Works offline
✗ Users can't auto-update
```

### Method 2: ZIP Distribution
```
✓ Users can load unpacked
✓ Easy to modify
✗ Development mode flag shows
✗ Requires developer mode enabled
```

### Method 3: Chrome Web Store
```
✓ Official distribution
✓ Auto-updates
✓ User reviews & ratings
✗ Requires review process
✗ $5 developer account fee
```

### Method 4: Enterprise Deployment
```
✓ Deploy to entire organization
✓ Force installation
✓ Centralized management
✗ Requires Google Workspace
✗ Complex setup
```

---

## Updating the Extension

When you update the extension code:

### For ZIP Distribution
1. Update files
2. Run: `npm run package`
3. Re-distribute the new `.zip` file

### For CRX Distribution
1. Update files
2. Run: `npm run build && node scripts/create-crx.js`
3. The new `.crx` will be signed with the same key
4. Re-distribute the new `.crx` file

**Important:** Keep your `key.pem` file safe when updating!
The same key must be used for all future updates.

---

## Development vs Production

### Development Setup
```bash
# For testing during development
npm run build
# Then load unpacked from chrome://extensions/
```

### Production Packaging
```bash
# For distribution
npm run build
node scripts/create-crx.js
# Share dist/hackfest-extension.crx
```

---

## Security Best Practices

1. **Protect Your Key**
   - Store `key.pem` securely
   - Never commit to public repositories
   - Back up to secure location

2. **Verify Icons**
   - Use trusted icon sources
   - Ensure icons represent your brand
   - Keep file sizes reasonable

3. **Review Code Before Sharing**
   - Audit `manifest.json` permissions
   - Verify no sensitive data in code
   - Check all API integrations

4. **Testing**
   - Test on multiple Chrome versions
   - Test with/without Google API access
   - Test bookmark operations
   - Test task/calendar sync

---

## Next Steps

1. ✅ Install Node.js and dependencies: `npm install`
2. ✅ Build and package: `npm run build && npm run package`
3. ✅ Test in Chrome: Load the dist/hackfest-extension.zip
4. ✅ Create CRX for distribution: `node scripts/create-crx.js`
5. ✅ Share or publish!

---

## Support

- **Build Issues:** Check error messages and troubleshooting above
- **Chrome Extension Docs:** https://developer.chrome.com/docs/extensions/
- **CRX Package Docs:** https://github.com/oncletom/crx
- **Archiver Docs:** https://www.archiverjs.com/

Good luck! 🚀