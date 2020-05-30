import { success, notFound } from '../../services/response/'
import { Deploy } from '.'
import { Client } from '../client'

import * as fs from "fs";
const tmp = require('tmp');
// let SSE = require('express-sse'); 
import SSE from 'express-sse';
let sse = new SSE();
let NodeSSH = require('node-ssh');
let ssh = new NodeSSH();

export const create = (req, res, next) => {

}

export const test = (req, res, next) =>
  ssh.connect({
    host: req.body.host,
    username: req.body.username,
    password: req.body.password,
  }).then(() => {
    res.status(200).json({ "success": "alles gut " });
  })
    .catch((err) => {
      res.status(500).json({ err });
      next();
    })


export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  Deploy.find(query, select, cursor)
    .then((deploys) => deploys.map((deploy) => deploy.view()))
    .then(success(res))
    .catch(next)
}

export const show = ({ params }, res, next) => {
  Deploy.findById(params.id)
    .then(notFound(res))
    .then((deploy) => deploy ? deploy.view() : null)
    .then(success(res))
    .catch(next)
}

export const deploy = (req, res, next) => {
  sse.init(req, res)
  Client.findById(req.params.id)
    .populate('variables')
    .then(notFound(res))
    .then((client) => {
      if (client) {
        // config within client spec  ^
        sse.send('Establishing SSH connexion', 'step');
        ssh.connect({//step 1
          host: client.host,
          username: client.userName,
          password: client.password
        }).then(() => {//------------------------------------------first STEP
          sse.send('SSH connexion established', 'feedback');
          sse.send('Starting file Transfer', 'step');
          if (client.file) {
            return ssh.putFile('./' + client.file, "docker-compose.yml").then(() => {
              sse.send('Docker-compose.yml file has been sent successfully', 'feedback');
            }, (err) => {
              console.log(err);
              sse.send('Something went wrong while sending the file', 'error');
              return Promise.reject(err);
            });
          } else {
            sse.send('Docker-compose file not found', 'error');
            return Promise.reject();
          }
        }, (err) => {
          console.log("error mta3 el connexion", err);
          sse.send(`can't connect to the server`, 'error');
          return Promise.reject(err);
        }).then(() => {//--------------------------------------------second STEP
          tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
            if (err) return Promise.reject(err);
            client.variables.forEach(element => {
              fs.appendFile(path, element.key + " = " + element.value + "\n", (err) => {
                if (err) {
                  return Promise.reject(err);
                }
              });
            });
            return ssh.putFile(path, ".env").then(() => {
              sse.send('.env File has been sent successfully', 'feedback');
              sse.send('Demployment process started', 'step');
              cleanupCallback();
            }
              , (err) => { //handle error step2 file transfer 
                console.log(err);
                sse.send('Something went wrong while sending .env file', 'error');
                cleanupCallback();
                return Promise.reject(err);
              });
          });

        }, (err) => {
          sse.send('Something went wrong while sending .env file', 'error');
          return Promise.reject(err);
        }).then(() => {
          // return ssh.exec('docker-compose up', ['-d'], {
          //   onStdout(chunk) {
          //     console.log(chunk.toString('utf8'));
          //     sse.send(chunk.toString('utf8'), 'feedback');
          //   },
          //   onStderr(chunk) {
          //     console.log(chunk.toString('utf8'))
          //     sse.send('Something went wrong', 'error')
          //     return Promise.reject();
          //   }
          // })
          return ssh.execCommand('docker-compose up -d', {  }).then((result) => {
            console.log('STDOUT: ' + result.stdout)
            console.log('STDERR: ' + result.stderr)
          })
        }, (err) => {
          console.log(err);
          sse.send('Something went wrong while running docker-compose', 'error');
          return Promise.reject(err);
        }).then(null, (err) => {
          console.log(err);
          return Promise.reject(err);
        }).then(() => {
          sse.send('Demployment process finished', 'step')
          let version = "";
          try {
            version = client.variables.find(element => element.key === "VERSION").value
          }
          catch (err) {
            sse.send(`VERSION variable not found`, 'feedback')
          }
          Object.assign(client, {
            status: "Deployed",
            version: version ? version : "Empty"
          }).save()
          sse.send(`Services are running on client's server`, 'success')
        }, (err) => {
          console.log("error fi el partie mta3 cmd docker compose  ", err);
          sse.send(`Something went wrong changing client info`, 'error')
          return Promise.reject(err);
        })

      } else {
        sse.send('Client not Found', 'error')
        return null
      };
    })
    .then(success(res))
    .catch(next)
}

export const update = (req, res, next) => {
  sse.init(req, res)
  Client.findById(req.params.id)
    .populate('variables')
    .then(notFound(res))
    .then((client) => {
      if (client) {
        // config within client spec
        sse.send('establishing SSH connexion', 'step')
        ssh.connect({
          host: client.host,
          username: client.userName,
          password: client.password
        }).then(() => {
          sse.send('Starting file Transfer', 'step')
          return ssh.putFile('./' + client.file, "docker-compose.yml").then(() => {
            sse.send('File has been sent successfully', 'feedback')
          }, (err) => {
            console.log(err);
            sse.send('Something went wrong while sending the file', 'error');
            return Promise.reject(err);
          })
          // return Promise.reject(err);
        }, (err) => { // handle Error step 1
          console.log("error mta3 el connxion", err);
          sse.send(`can't connect to the server`, 'error')
          return Promise.reject(err);

        }).then(() => { // tab3ath .env

          tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
            if (err) return Promise.reject(err);

            client.variables.forEach(element => {
              fs.appendFile(path, element.key + " = " + element.value + "\n", (err) => {
                if (err) {
                  return Promise.reject(err);
                }
              })
            })
            return ssh.putFile(path, ".env").then(() => {
              sse.send('File has been sent successfully', 'feedback')
              cleanupCallback();
            }, (err) => { //handle error step2 file transfer 
              console.log(err);
              sse.send('Something went wrong while sending the file', 'error');
              cleanupCallback();
              return Promise.reject(err);
            })
          });

        }).then(() => {
          sse.send('Demployment process started', 'step')
          console.log('--------------------------------------------------------partie deploiment');

          return ssh.exec('docker --version', [], {
            onStdout(chunk) {
              sse.send(chunk.toString('utf8'), 'feedback')
            },
            onStderr(chunk) {
              sse.send(chunk.toString('utf8'), 'feedback')
              sse.send('Somthing went wrong', 'error')
              return Promise.reject(err);
            },
          })
        }, (err) => {//handle erro send .env + create temp .env file
          console.log("error mta3 el .env file", err);
          sse.send(`Error while sending .env`, 'error')
          return Promise.reject(err);

        }).then(() => {
          // console.log('---------------------------------------------------finalize');
          sse.send('Demployment process finished', 'step')
          sse.send(`Services are running on client's server`, 'success')
          console.log("version------------------------------------", client.variables.find(element => element.key === "VERSION").value);
          Object.assign(client, {
            status: "Deployed",
            version: client.variables.find(element => element.key === "VERSION").value,
            prevVersions: client.prevVersions.push("new_1")
          }).save()
        }, (err) => {
          console.log("error fi el partie mta3 cmd docker compose  ", err);
          sse.send(`Something went wrong changing client info`, 'error')
          return Promise.reject(err);
        })
      } else return null;
    })
    .then(success(res))
    .catch(next)

}
// Deploy.findById(params.id)
//   .then(notFound(res))
//   .then((deploy) => deploy ? Object.assign(deploy, body).save() : null)
//   .then((deploy) => deploy ? deploy.view(true) : null)
//   .then(success(res))
//   .catch(next)

export const rollback = (req, res, next) =>
// Deploy.findById(params.id)
//   .then(notFound(res))
//   .then((deploy) => deploy ? deploy.remove() : null)
//   .then(success(res, 204))
//   .catch(next)
{
  sse.init(req, res)
  sse.send('Rollback process started', 'step')
  Client.findById(req.params.id)
    .then(notFound(res))
    .then((client) => {
      if (client.status === 'Deployed') {
        // config within client spec
        sse.send('establishing SSH connexion', 'step')
        ssh.connect({
          host: client.host,
          username: client.userName,
          password: client.password
        }).then(() => {
          // send docker-compose.file
          sse.send('Stop services', 'step')
          // stopping docker compose
          ssh.exec('/snap/bin/docker -v', [], {
            // cwd: '/var/www',
            onStdout(chunk) {
              sse.send(chunk.toString('utf8'), 'feedback')
            },
            onStderr(chunk) {
              sse.send(chunk.toString('utf8'), 'feedback')
            },
          })
        }).then(() => {
          Object.assign(client, { status: "Deployed" }).save()
          sse.send(`Services updated on client's server`, 'success')
        })


        //set status on client / deploy object & return client obj 

        // return client.view()
      } else return null;


    })
    .then(success(res))
    .catch(next)
}

export const destroy = (req, res, next) =>
// Deploy.findById(params.id)
//   .then(notFound(res))
//   .then((deploy) => deploy ? deploy.remove() : null)
//   .then(success(res, 204))
//   .catch(next)
{
  sse.init(req, res)
  sse.send('Stopping process started', 'step')
  Client.findById(req.params.id)
    .then(notFound(res))
    .then((client) => {
      if (client.status === 'Deployed') {
        // config within client spec
        sse.send('Establishing SSH connexion', 'step')
        ssh.connect({
          host: client.host,
          username: client.userName,
          password: client.password

        }).then(() => {
          sse.send('Stopping services', 'step')
          Object.assign(client, { status: "Not deployed" }).save()
          sse.send(`Services stopped on client's server`, 'success')
          console.log("-------------finish Stopping------------------");
        })
      } else return null;


    })
    .then(success(res))
    .catch(next)
}
