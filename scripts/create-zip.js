#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Create ZIP file for extension distribution
 */

const distDir = path.join(__dirname, '..', 'dist');
const sourceDir = path.join(__dirname, '..');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const output = fs.createWriteStream(path.join(distDir, 'hackfest-extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log(`\n✓ Created: dist/hackfest-extension.zip (${archive.pointer()} bytes)`);
    console.log('\n📦 Extension packaged successfully!');
    console.log('\nTo install:');
    console.log('1. Go to chrome://extensions/');
    console.log('2. Extract the ZIP file');
    console.log('3. Click "Load unpacked"');
    console.log('4. Select the extracted folder\n');
});

archive.on('error', (err) => {
    console.error('Error creating ZIP:', err);
    process.exit(1);
});

archive.pipe(output);

// Add files to archive, excluding unnecessary items
const filesToInclude = [
    'manifest.json',
    'newtab.html',
    'newtab.js',
    'styles.css',
    'background.js',
    'popup.html',
    'icons/icon16.png',
    'icons/icon48.png',
    'icons/icon128.png'
];

filesToInclude.forEach(file => {
    const filePath = path.join(sourceDir, file);
    if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
    }
});

archive.finalize();
