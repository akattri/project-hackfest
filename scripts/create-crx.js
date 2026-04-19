#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Crx = require('crx');
const archiver = require('archiver');

/**
 * Create CRX file (Chrome extension package)
 * For production/distribution of Chrome extensions
 */

const distDir = path.join(__dirname, '..', 'dist');
const sourceDir = path.join(__dirname, '..');
const keyPath = path.join(distDir, 'key.pem');

console.log('🔐 Creating CRX package...\n');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Create a temporary directory for the extension files
const tempDir = path.join(distDir, '.temp-crx');
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Copy extension files to temp directory
const filesToInclude = [
    'manifest.json',
    'newtab.html',
    'newtab.js',
    'styles.css',
    'background.js',
    'popup.html',
    'icons'
];

filesToInclude.forEach(file => {
    const source = path.join(sourceDir, file);
    const dest = path.join(tempDir, file);
    
    if (!fs.existsSync(source)) {
        return; // Skip if file doesn't exist
    }
    
    if (fs.statSync(source).isDirectory()) {
        // Copy directory
        copyDir(source, dest);
    } else {
        // Copy file
        fs.copyFileSync(source, dest);
    }
});

// Generate or load key
let crx;
if (fs.existsSync(keyPath)) {
    console.log('✓ Using existing key.pem');
    const privateKey = fs.readFileSync(keyPath);
    crx = new Crx({ privateKey });
} else {
    console.log('⚠  No key.pem found. Generating new key...');
    crx = new Crx();
    fs.writeFileSync(keyPath, crx.privateKey, 'utf8');
    console.log(`✓ Generated and saved key: ${keyPath}`);
    console.log('  IMPORTANT: Keep this key safe! It signs your extension.');
}

// Build the CRX
const crxPath = path.join(distDir, 'hackfest-extension.crx');

crx.load(tempDir)
    .then(() => crx.pack())
    .then((crxBuffer) => {
        fs.writeFileSync(crxPath, crxBuffer);
        
        // Clean up temp directory
        fs.rmSync(tempDir, { recursive: true });
        
        console.log(`\n✓ Created CRX file: ${crxPath}`);
        console.log(`  Size: ${crxBuffer.length} bytes`);
        console.log('\n📦 Extension is ready for distribution!');
        console.log('\nTo install the CRX:');
        console.log('1. Go to chrome://extensions/');
        console.log('2. Drag and drop the .crx file OR');
        console.log('3. Click "Load unpacked" and select the folder');
        console.log('\n⚠️  Remember to keep your key.pem file safe!');
    })
    .catch(err => {
        console.error('✗ Error creating CRX:', err);
        
        // Clean up temp directory on error
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
        }
        
        process.exit(1);
    });

/**
 * Helper function to recursively copy directories
 */
function copyDir(source, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(source);
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(sourcePath).isDirectory()) {
            copyDir(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    });
}
