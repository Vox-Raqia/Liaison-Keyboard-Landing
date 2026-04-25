const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'scenarios/difficult-boss.html',
  'scenarios/mixed-signals-dating.html',
  'scenarios/set-a-boundary-with-family.html'
];

function processHTML(content) {
  // Add loading="lazy" to all <img> tags that don't already have a loading attribute
  // but preserve loading="eager" for above-the-fold images (logo, hero main)
  return content.replace(/<img([^>]*?)>/g, (match, attrs) => {
    // Skip if already has loading attribute
    if (/loading\s*=/.test(attrs)) return match;

    // Determine if this is an above-the-fold image that should stay eager
    // Heuristic: images with class containing 'brand-wordmark', 'hero-real-image', 'hero-story-image' (first one)
    const isEager = /class\s*=\s*["'][^"']*(brand-wordmark|hero-real-image|hero-story-image)/.test(attrs) &&
                    !/hero-story-image/.test(attrs); // Keep first story image eager for LCP? Actually story images are below fold; let's make them lazy too

    // Actually for simplicity, add lazy to all except logo and the main hero dashboard image
    const shouldBeEager = /brand-wordmark|hero-real-image/.test(attrs);

    if (shouldBeEager) {
      return `<img${attrs} loading="eager">`;
    } else {
      return `<img${attrs} loading="lazy">`;
    }
  });
}

htmlFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let html = fs.readFileSync(fullPath, 'utf8');
  const updated = processHTML(html);
  if (updated !== html) {
    fs.writeFileSync(fullPath, updated);
    console.log(`✅ Updated ${file} with lazy loading`);
  } else {
    console.log(`⚠️  No changes to ${file}`);
  }
});

console.log('Image lazy loading optimization complete.');
