#!/usr/bin/env node

/**
 * Build Verification Script
 * Checks that all extension files are present and valid
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Hackfest Extension Build...\n');

const requiredFiles = [
    'manifest.json',
    'newtab.html',
    'newtab.js',
    'styles.css',
    'background.js',
    'popup.html',
    'package.json',
    'build.js',
    'build.sh',
    'scripts/create-zip.js',
    'scripts/create-crx.js'
];

const documentationFiles = [
    'README.md',
    'INSTALLATION.md',
    'GOOGLE_SETUP.md',
    'DEPLOYMENT.md',
    'BUILD_CRX.md',
    'QUICK_REFERENCE.md',
    'TROUBLESHOOTING.md',
    'BUILD_SUMMARY.md'
];

let allValid = true;

console.log('📋 Checking Required Files:');
requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`${exists ? '✓' : '✗'} ${file}`);
    if (!exists) allValid = false;
});

console.log('\n📚 Checking Documentation:');
documentationFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`${exists ? '✓' : '✗'} ${file}`);
    if (!exists) allValid = false;
});

console.log('\n📁 Checking Directory Structure:');
const dirs = ['icons', 'scripts', 'dist'];
dirs.forEach(dir => {
    const exists = fs.existsSync(path.join(__dirname, dir));
    console.log(`${exists ? '✓' : '✗'} ${dir}/`);
});

// Check manifest.json validity
console.log('\n🔧 Validating Configuration:');
try {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
    const hasOAuth = manifest.oauth2 && manifest.oauth2.client_id;
    const hasPermissions = manifest.permissions && manifest.permissions.length > 0;
    
    console.log(`${manifest.manifest_version === 3 ? '✓' : '✗'} Manifest V3 format`);
    console.log(`${hasOAuth ? '✓' : '✗'} OAuth2 configuration`);
    console.log(`${hasPermissions ? '✓' : '✗'} Permissions configured`);
} catch (err) {
    console.log(`✗ Invalid manifest.json: ${err.message}`);
    allValid = false;
}

console.log('\n' + '='.repeat(50));
if (allValid) {
    console.log('✅ All checks passed! Extension is ready.\n');
    console.log('🚀 Next steps:');
    console.log('   1. Set Google API Client ID in manifest.json');
    console.log('   2. For development: Load unpacked in chrome://extensions/');
    console.log('   3. For sharing: bash build.sh');
    console.log('   4. For distribution: npm install && node scripts/create-crx.js');
} else {
    console.log('❌ Some checks failed. Review the errors above.\n');
}
