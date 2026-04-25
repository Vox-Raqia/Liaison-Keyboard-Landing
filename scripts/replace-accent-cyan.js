const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'site.css');
let css = fs.readFileSync(cssPath, 'utf8');
const before = css.length;

// Replace all var(--accent-cyan) with var(--accent)
css = css.replace(/var\(--accent-cyan\)/g, 'var(--accent)');

if (css.length !== before) {
  fs.writeFileSync(cssPath, css);
  console.log(`✅ Replaced all var(--accent-cyan) occurrences (${before} → ${css.length} chars)`);
} else {
  console.log('⚠️  No var(--accent-cyan) found or already replaced');
}
