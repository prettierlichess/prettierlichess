const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcManifest = path.join(root, 'src', 'manifest.firefox.json');
const outDir = path.join(root, 'dist');
const outManifest = path.join(outDir, 'manifest.json');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!fs.existsSync(srcManifest)) {
  fail(`Source Firefox manifest not found: ${srcManifest}`);
}

if (!fs.existsSync(outDir)) {
  fail(`Output directory not found (run build first): ${outDir}`);
}

try {
  const data = fs.readFileSync(srcManifest, 'utf8');
  // ensure valid JSON
  JSON.parse(data);
  fs.writeFileSync(outManifest, data, 'utf8');
  console.log(`Wrote Firefox manifest to ${outManifest}`);
} catch (err) {
  fail(`Failed to write firefox manifest: ${err.message}`);
}
