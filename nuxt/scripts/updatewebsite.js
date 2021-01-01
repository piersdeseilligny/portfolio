/**
 * updatewebsite.js
 * Connect via SSH to the web server, and perform a git pull, updating the website
 */

require('dotenv').config();
var NodeSSH = require('node-ssh').NodeSSH;
const ssh = new NodeSSH()

console.log(`Connecting via SSH to ${process.env.SSH_HOST}:${process.env.SSH_PORT} as ${process.env.SSH_USER}`);

ssh.connect({
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USER,
  password:process.env.SSH_PASSWORD
}).then(function(){
    console.log("Connected");
    ssh.exec('cd repo && git pull --rebase', [], {
      onStdout(chunk) {
        let str = chunk.toString('utf8');
        console.log(str);
        if(str == "Already up to date.\n"){
          ssh.dispose();
        }
      },
      onStderr(chunk) {
        console.log(chunk.toString('utf8'));
      },
    });
}, function(reason){
    console.log("Failed to connect through SSH! " + reason);
    ssh.dispose();
});
