const fs = require('fs');
const path = require('path');

// Simple PNG to WebP converter using imagemin-webp (to be installed)
// Run: node scripts/convert-images.js
// Requires: npm install imagemin imagemin-webp

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const assetsDir = path.join(__dirname, '..', 'assets');
const previewsDir = path.join(assetsDir, 'previews');

async function convert() {
  const files = await imagemin([`${previewsDir}/*.png`], {
    destination: previewsDir,
    plugins: [
      imageminWebp({ quality: 80, lossless: false })
    ]
  });
  console.log(`Converted ${files.length} images to WebP`);
}

convert().catch(console.error);
