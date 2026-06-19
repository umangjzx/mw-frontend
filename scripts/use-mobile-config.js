/**
 * Pre-build script for mobile: swaps next.config.mjs with next.config.mobile.mjs
 * and removes incompatible dynamic route configs for static export.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const webConfig = path.join(root, 'next.config.mjs');
const webConfigJs = path.join(root, 'next.config.js');
const mobileConfig = path.join(root, 'next.config.mobile.mjs');
const backupConfig = path.join(root, 'next.config.web-backup.mjs');
const backupConfigJs = path.join(root, 'next.config.web-backup.js');
const layoutFile = path.join(root, 'src', 'app', 'layout.tsx');
const layoutBackup = path.join(root, 'src', 'app', 'layout.tsx.web-backup');
const middlewareFile = path.join(root, 'src', 'middleware.ts');
const middlewareBackup = path.join(root, 'src', 'middleware.ts.web-backup');

// Backup and remove next.config.js (it takes precedence over .mjs)
if (fs.existsSync(webConfigJs)) {
  fs.renameSync(webConfigJs, backupConfigJs);
  console.log('✓ Moved next.config.js → next.config.web-backup.js (would override .mjs)');
}

// Backup the web config .mjs
if (fs.existsSync(webConfig)) {
  fs.copyFileSync(webConfig, backupConfig);
  console.log('✓ Backed up next.config.mjs → next.config.web-backup.mjs');
}

// Copy mobile config in place
if (fs.existsSync(mobileConfig)) {
  fs.copyFileSync(mobileConfig, webConfig);
  console.log('✓ Replaced next.config.mjs with mobile config (static export enabled)');
} else {
  console.error('✗ next.config.mobile.mjs not found!');
  process.exit(1);
}

// Remove 'force-dynamic' from layout.tsx (incompatible with output: 'export')
if (fs.existsSync(layoutFile)) {
  fs.copyFileSync(layoutFile, layoutBackup);
  let content = fs.readFileSync(layoutFile, 'utf8');
  content = content.replace(/\/\/ Force dynamic rendering.*\n/g, '');
  content = content.replace(/export const dynamic = ['"]force-dynamic['"];\n?/g, '');
  fs.writeFileSync(layoutFile, content, 'utf8');
  console.log('✓ Removed force-dynamic from layout.tsx for static export');
}

// Temporarily rename middleware.ts (incompatible with static export)
if (fs.existsSync(middlewareFile)) {
  fs.renameSync(middlewareFile, middlewareBackup);
  console.log('✓ Disabled middleware.ts for static export (moved to .web-backup)');
}
