#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Build script for Hackfest Extension
 * Creates icons and packages the extension into a distributable format
 */

console.log('🔨 Building Hackfest Extension...\n');

// Step 1: Create icon files if they don't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Create minimal valid PNG files
const createPlaceholderPNG = (size) => {
    // Minimal 1x1 transparent PNG
    return Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00,
        0x90, 0x77, 0x53, 0xDE,
        0x00, 0x00, 0x00, 0x0C,
        0x49, 0x44, 0x41, 0x54,
        0x08, 0x99, 0x01, 0x01, 0x00, 0x00,
        0xFE, 0xFF, 0x00, 0x00, 0x00, 0x02,
        0x00, 0x01,
        0x49, 0xB4, 0xE8, 0xB7,
        0x00, 0x00, 0x00, 0x00,
        0x49, 0x45, 0x4E, 0x44,
        0xAE, 0x42, 0x60, 0x82
    ]);
};

const sizes = [16, 48, 128];
sizes.forEach(size => {
    const iconPath = path.join(iconsDir, `icon${size}.png`);
    if (!fs.existsSync(iconPath)) {
        fs.writeFileSync(iconPath, createPlaceholderPNG(size));
        console.log(`✓ Created icon${size}.png`);
    } else {
        console.log(`✓ icon${size}.png already exists`);
    }
});

// Step 2: Create distribution directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

console.log('\n✓ Icons ready');
console.log(`✓ Distribution directory: ${distDir}`);
console.log('\n Build complete!');
console.log('\nNext steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run package');
console.log('   This will create: dist/hackfest-extension.zip');
console.log('\ To create a .crx file:');
console.log('   See BUILD_CRX.md for complete instructions');
