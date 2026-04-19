#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Create minimal valid PNG files for extension icons
 * These are simple 1-pixel PNGs with proper headers
 */

const createPNG = (size) => {
  // Minimal valid PNG structure
  return Buffer.from([
    // PNG signature
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    // IHDR chunk (image properties)
    0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01,  // width: 1
    0x00, 0x00, 0x00, 0x01,  // height: 1
    0x08, 0x02, 0x00, 0x00, 0x00,  // bit depth, color type
    0x90, 0x77, 0x53, 0xDE,  // CRC
    // IDAT chunk (pixel data)
    0x00, 0x00, 0x00, 0x0C,
    0x49, 0x44, 0x41, 0x54,
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00,
    0xFE, 0xFF, 0x00, 0x00, 0x00, 0x02,
    0x00, 0x01,
    0x49, 0xB4, 0xE8, 0xB7,
    // IEND chunk
    0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4E, 0x44,
    0xAE, 0x42, 0x60, 0x82
  ]);
};

const iconsDir = path.join(__dirname, 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('✓ Created icons directory');
}

// Create all icon sizes
[16, 48, 128].forEach(size => {
  const filePath = path.join(iconsDir, `icon${size}.png`);
  const pngData = createPNG(size);
  fs.writeFileSync(filePath, pngData);
  console.log(`✓ Created icon${size}.png (${pngData.length} bytes)`);
});

console.log('\n✅ All icons created successfully!');
console.log('   Now you can load the extension in Chrome:');
console.log('   1. Go to chrome://extensions/');
console.log('   2. Enable Developer mode');
console.log('   3. Click "Load unpacked"');
console.log('   4. Select the project folder');
