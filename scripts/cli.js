#!/usr/bin/env node

import { createBackup, restoreBackup, listBackups } from './backup.js';

const command = process.argv[2];

switch (command) {
  case 'create':
    createBackup();
    break;
  
  case 'restore':
    const backupId = process.argv[3];
    if (!backupId) {
      console.error('Please provide a backup ID');
      process.exit(1);
    }
    restoreBackup(backupId);
    break;
  
  case 'list':
    listBackups();
    break;
  
  default:
    console.log(`
Usage:
  npm run backup         Create a new backup
  npm run restore [id]   Restore from backup
  npm run list-backups   List all backups
    `);
}