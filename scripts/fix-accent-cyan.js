const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'site.css');
let css = fs.readFileSync(cssPath, 'utf8');
const original = css;

// Replace all instances of var(--accent-cyan) with var(--accent)
css = css.replace(/var\(--accent-cyan\)/g, 'var(--accent)');

if (css !== original) {
  fs.writeFileSync(cssPath, css);
  console.log('✅ Replaced all var(--accent-cyan) with var(--accent)');
} else {
  console.log('⚠️  No changes made');
}
