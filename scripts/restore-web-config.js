/**
 * Post-build script: restores all original files after mobile build.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const webConfig = path.join(root, 'next.config.mjs');
const webConfigJs = path.join(root, 'next.config.js');
const backupConfig = path.join(root, 'next.config.web-backup.mjs');
const backupConfigJs = path.join(root, 'next.config.web-backup.js');
const layoutFile = path.join(root, 'src', 'app', 'layout.tsx');
const layoutBackup = path.join(root, 'src', 'app', 'layout.tsx.web-backup');
const middlewareFile = path.join(root, 'src', 'middleware.ts');
const middlewareBackup = path.join(root, 'src', 'middleware.ts.web-backup');

// Restore next.config.js from backup
if (fs.existsSync(backupConfigJs)) {
  fs.renameSync(backupConfigJs, webConfigJs);
  console.log('✓ Restored next.config.js from backup');
}

// Restore next.config.mjs from backup
if (fs.existsSync(backupConfig)) {
  fs.copyFileSync(backupConfig, webConfig);
  fs.unlinkSync(backupConfig);
  console.log('✓ Restored next.config.mjs from backup');
} else {
  console.warn('⚠ No .mjs config backup found');
}

// Restore layout.tsx from backup
if (fs.existsSync(layoutBackup)) {
  fs.copyFileSync(layoutBackup, layoutFile);
  fs.unlinkSync(layoutBackup);
  console.log('✓ Restored layout.tsx from backup');
} else {
  console.warn('⚠ No layout backup found');
}

// Restore middleware.ts from backup
if (fs.existsSync(middlewareBackup)) {
  fs.renameSync(middlewareBackup, middlewareFile);
  console.log('✓ Restored middleware.ts from backup');
} else {
  console.warn('⚠ No middleware backup found');
}
