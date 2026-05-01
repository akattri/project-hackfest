#!/bin/bash

# Simple build script for Archon
# Creates a ZIP file that can be loaded into Chrome

set -e

echo "🔨 Building Archon"
echo ""

# Create dist directory
mkdir -p dist
mkdir -p icons

# Create placeholder PNG icons if they don't exist
create_icon() {
    local size=$1
    local path="icons/icon${size}.png"
    
    if [ ! -f "$path" ]; then
        # Create a minimal 1x1 transparent PNG using base64
        # This is a valid PNG that Chrome will accept
        echo -ne '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDAT\x08\x99\x01\x01\x00\x00\xfe\xff\x00\x00\x00\x02\x00\x01I\xb4\xe8\xb7\x00\x00\x00\x00IEND\xaeB`\x82' > "$path"
        echo "✓ Created icon${size}.png"
    else
        echo "✓ icon${size}.png already exists"
    fi
}

# Create all icon sizes
create_icon 16
create_icon 48
create_icon 128

echo ""
echo "📦 Creating extension package..."

# Create ZIP file using zip command
if command -v zip &> /dev/null; then
    cd dist
    zip -r hackfest-extension.zip \
        ../manifest.json \
        ../newtab.html \
        ../newtab.js \
        ../styles.css \
        ../background.js \
        ../popup.html \
        ../icons/icon*.png \
        > /dev/null 2>&1
    cd ..
    SIZE=$(stat -f%z "dist/hackfest-extension.zip" 2>/dev/null || stat -c%s "dist/hackfest-extension.zip" 2>/dev/null || echo "?")
    echo "✓ Created: dist/hackfest-extension.zip ($SIZE bytes)"
else
    echo "✗ 'zip' command not found. Install with:"
    echo "  Ubuntu/Debian: sudo apt-get install zip"
    echo "  Mac: brew install zip"
    exit 1
fi

echo ""
echo "✨ Build complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to chrome://extensions/"
echo "2. Enable Developer mode"
echo "3. Click 'Load unpacked'"
echo "4. Select the project folder"
echo ""
echo "OR extract the ZIP and load it."
echo ""
echo "For CRX file (distributable):"
echo "  npm install && node scripts/create-crx.js"
