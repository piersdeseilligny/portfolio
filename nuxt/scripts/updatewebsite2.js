/**
 * updatewebsite.js
 * Synchronizes the local /dist folder with the remote web server using Rsync over SSH.
 */

require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');

// Configuration
const localDir = path.join(__dirname, 'dist/'); // Ensure trailing slash
const remoteDir = `${process.env.SSH_USER}@${process.env.SSH_HOST}:${process.env.REMOTE_WEB_ROOT}`;
const sshPort = process.env.SSH_PORT || 22;

/**
 * Rsync Flags:
 * -a: Archive mode (preserves permissions, symlinks, etc.)
 * -v: Verbose
 * -z: Compress data during transfer
 * --delete: DELETE files on the server that no longer exist locally (keeps it clean!)
 * -e: Specifies the remote shell (to handle custom SSH ports)
 */
const rsyncCommand = `rsync -avz --delete -e "ssh -p ${sshPort}" ${localDir} ${remoteDir}`;

console.log(`🚀 Starting deployment to ${process.env.SSH_HOST}...`);

const deploy = exec(rsyncCommand);

deploy.stdout.on('data', (data) => {
  console.log(data.toString());
});

deploy.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

deploy.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Website updated successfully!');
  } else {
    console.error(`❌ Deployment failed with exit code ${code}`);
  }
});