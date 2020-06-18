import * as fs from "fs";
import NodeSSH from 'node-ssh';
import tmp from 'tmp';
import cmdParser from "./parser";
let ssh = new NodeSSH();

export const connect = (host, username, password)=>{
    console.log("----------------------step 1");
    
    return ssh.connect({
      host: host,
      username: username,
      password: password
    })
  }

export const stepError = (n)=>{
  console.log('error catched ', n);
  
  throw(n);
}

export const fileTransfer = (file, sse = null)=>{
  console.log("----------------------step 2");
    if (sse) {
      sse.send('SSH connexion established', 'feedback');
      sse.send('Starting file Transfer', 'step');
    }
    if (file) {
      return ssh.putFile('./' +file, "docker-compose.yml").then(() => {
       if (sse) sse.send('Docker-compose.yml file has been sent successfully', 'feedback');
      });
      } else {
        if (sse) sse.send('Docker-compose file not found', 'error');
        throw new Error("Whoops!");
      }
}


export const envFile = (variables, sse = null)=> {
     tmp.file((err, path, fd, cleanupCallback) => {
          if (err) return Promise.reject(err);
          variables.forEach(element => {
            fs.appendFile(path, element.key + '=' + element.value + '\n', (err) => {
              if (err) {
                // return Promise.reject("from env file", err);
              }
            });
          });
          return ssh.putFile(path, '.env').then(() => {
           if (sse) {
            sse.send('.env File has been sent successfully', 'feedback');
            sse.send('Demployment process started', 'step');
          }
            cleanupCallback();
          })
       });
    
}

export const envFileRollback = (variables, sse, prevVersion)=> {
     tmp.file((err, path, fd, cleanupCallback) => {
          if (err) return Promise.reject(err);
          variables.forEach(element => {
            if (element.key !== 'VERSION') {
              fs.appendFile(path, element.key + '=' + element.value + '\n', (err) => {
                if (err) {
                  // return Promise.reject("from env file", err);
                }
              });
            } else fs.appendFile(path, element.key + '=' + prevVersion + '\n', (err) => {
              if (err) {
                // return Promise.reject("from env file", err);
              }
            });
          });
          return ssh.putFile(path, '.env').then(() => {
           if (sse) {
            sse.send('.env File has been sent successfully', 'feedback');
            sse.send('Demployment process started', 'step');
          }
            cleanupCallback();
          })
       });
}

export const composeUp = (sse) =>{
  console.log("----------------------step 3");
  
  return ssh.execCommand('docker-compose up -d', {  }).then((result) => {
    sse.send('STDOUT: ' + result.stdout ,'feedback' )
    sse.send('STDERR: ' + result.stderr, 'feedback')
  })
}
export const composeUpdate = (sse = null) =>{
  console.log("---------UPDATE-------------step 3");
  
  return ssh.execCommand('docker-compose down --volumes && docker-compose ps && docker-compose up -d ', {  }).then((result) => {
   if (sse) sse.send('STDOUT: ' + result.stdout ,'feedback' );
    console.log('STDOUT: ' + result.stdout ,'feedback' );
   if (sse) sse.send('STDERR: ' + result.stderr, 'feedback');
    console.log('STDERR: ' + result.stderr, 'feedback');
  })
}
export const composeDown = (sse) =>{
  console.log("----------------------step 2");
  
  return ssh.execCommand('docker-compose down --volumes', {  }).then((result) => {
    sse.send('STDOUT: ' + result.stdout ,'feedback' )
    sse.send('STDERR: ' + result.stderr, 'feedback')
  })
}

export const composePs = () =>{
  console.log("----------------------step 2");
  
  return ssh.execCommand(`docker container ls `, {  }).then((result) => {
    console.log(result.stdout )
    // sse.send('STDERR: ' + result.stderr, 'feedback')
    // console.log(cmdParser(result.stdout));
  })
}



