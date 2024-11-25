import fs from 'fs';
import path from 'path';

const BACKUP_DIR = 'backups';
const DIRS_TO_BACKUP = ['src', 'public'];
const FILES_TO_BACKUP = [
  'package.json',
  'version.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.js',
  'index.html'
];

function getCurrentTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function createBackup() {
  const timestamp = getCurrentTimestamp();
  const backupDir = path.join(BACKUP_DIR, `backup-${timestamp}`);

  // Create backup directory
  fs.mkdirSync(backupDir, { recursive: true });

  // Backup individual files
  FILES_TO_BACKUP.forEach(file => {
    if (fs.existsSync(file)) {
      const destPath = path.join(backupDir, file);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(file, destPath);
    }
  });

  // Backup directories
  DIRS_TO_BACKUP.forEach(dir => {
    if (fs.existsSync(dir)) {
      copyDirectory(dir, path.join(backupDir, dir));
    }
  });

  // Create version info
  const versionInfo = JSON.parse(fs.readFileSync('version.json', 'utf8'));
  const backupInfo = {
    ...versionInfo,
    backupDate: timestamp,
    backupId: `backup-${timestamp}`
  };

  fs.writeFileSync(
    path.join(backupDir, 'backup-info.json'),
    JSON.stringify(backupInfo, null, 2)
  );

  console.log(`Backup created: backup-${timestamp}`);
  return `backup-${timestamp}`;
}

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function restoreBackup(backupId) {
  const backupPath = path.join(BACKUP_DIR, backupId);
  
  if (!fs.existsSync(backupPath)) {
    console.error(`Backup ${backupId} not found`);
    return false;
  }

  // Restore individual files
  FILES_TO_BACKUP.forEach(file => {
    const srcPath = path.join(backupPath, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, file);
    }
  });

  // Restore directories
  DIRS_TO_BACKUP.forEach(dir => {
    const srcPath = path.join(backupPath, dir);
    if (fs.existsSync(srcPath)) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
      }
      copyDirectory(srcPath, dir);
    }
  });

  console.log(`Restored backup: ${backupId}`);
  return true;
}

function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('No backups found');
    return [];
  }

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(name => name.startsWith('backup-'))
    .map(name => {
      const infoPath = path.join(BACKUP_DIR, name, 'backup-info.json');
      try {
        return JSON.parse(fs.readFileSync(infoPath, 'utf8'));
      } catch (err) {
        return { backupId: name, error: 'Invalid backup' };
      }
    });

  console.log('Available backups:');
  backups.forEach(backup => {
    console.log(`- ${backup.backupId} (${backup.version})`);
  });

  return backups;
}

export { createBackup, restoreBackup, listBackups };