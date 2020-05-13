import { success, notFound } from '../../services/response/'
import { Deploy } from '.'
import { Client } from '../client'

let SSE = require('express-sse');
let sse = new SSE();
let NodeSSH = require('node-ssh')
let ssh = new NodeSSH()

export const create = (req, res, next) =>

    {
       
    }

export const test = (req, res, next) =>
      ssh.connect({
      host: req.body.host,
      username: req.body.username,
      password: req.body.password 
    }).then(()=> {
      res.status(200).json({});
      })
    .catch((err)=>{
      res.status(500).json({});
      next();
    })
    

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  {
    Deploy.find(query, select, cursor)
    .then((deploys) => deploys.map((deploy) => deploy.view()))
    .then(success(res))
    .catch(next)
  }

export const show = ({ params }, res, next) =>
    {
      Deploy.findById(params.id)
      .then(notFound(res))
      .then((deploy) => deploy ? deploy.view() : null)
      .then(success(res))
      .catch(next) 
    }

export const deploy = (req, res, next) =>
    {   
        
        sse.init(req, res)
        // sse.send('Deployment process started', 'step')
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
              }).then(()=> {
                // send docker-compose.file
                sse.send('Starting file Transfer', 'step')
                // sse.send('Something went wrong while sending the file', 'error');
                ssh.putFile('./'+client.file,"docker-compose.yml").then(()=> {
                  sse.send('File has been sent successfully', 'feedback')
                  // normally hna bech tet7at el be9i 
                }, (error)=> {
                  sse.send('Something went wrong while sending the file', 'error');
                })
              }).catch(()=>{
                sse.send(`can't connect to the server`, 'error')
              })
              
              // .then(()=>{
              //   // send env vars to client server
              //   // ssh.execCommand('').then(function(result) {
              //   //   sse.send('STDOUT: ' + result.stdout)
              //   // if (result.stdout) {
              //   //   sse.send(result.stdout, 'feedback')
              //   // }
              //   // if (result.onStderr) {
              //   //   sse.send('Env Variable failed to be sent to ', 'error')
              //   // }
              //   // })
              // })
              .then(()=>{
                // ssh.execCommand('/snap/bin/docker image pull alpine').then(function(result) {
                //   console.log('STDOUT: ' + result.stdout)
                //   console.log('STDERR: ' + result.stderr)
                // })
                sse.send('Demployment process started', 'step')
                ssh.exec('/snap/bin/docker image pull alpine', [], {
                  // cwd: '/var/www',
                  onStdout(chunk) {
                    // console.log(chunk.toString('utf8'), 'feedback')
                    sse.send(chunk.toString('utf8'), 'feedback')
                  },
                  onStderr(chunk) {
                    sse.send( chunk.toString('utf8'), 'feedback')
                    sse.send( 'Somthing went wrong', 'error')
                  },
                }).then(()=>{
                sse.send('Demployment process finished', 'step')
                Object.assign(client, {status : "Deployed"}).save()
                sse.send(`Services are running on client's server`, 'success' )
                })
              })
              // .then(()=>{
              //   Object.assign(client, {status : "Deployed"}).save()
              //   sse.send(`Services are running on client's server`, 'success' )
              // })

            }else return null ;

          
        })
        .then(success(res))
        .catch(next)
            
      
      // Deploy.findById(params.id)
      // .then(notFound(res))
      // // .then((deploy) => deploy ? deploy.view() : null)
      // .then((deploy) =>{
      //   if(deploy){
      //     console.log(' chbih tekhdem ');
          
      //     return deploy.view();
      //   }else return null
      // })
      // .then(success(res))
      // .catch(next)
      
    }

export const update = (req, res, next) =>{

  sse.init(req, res)
  sse.send('Update process started', 'step')
  Client.findById(req.params.id)
  .then(notFound(res))
  .then((client) => {
      if (client.status==='Deployed') {
        // config within client spec
        sse.send('establishing SSH connexion', 'step')
        ssh.connect({
          host: client.host,
          username: client.userName,
          password: client.password 
        }).then(()=> {
          // send docker-compose.file
          sse.send('Starting file Transfer', 'step')
          ssh.putFile('./'+client.file,"docker-compose.yml").then(()=> {
            sse.send('File has been sent successfully to '+ client.clientName, 'feedback')
          }, (error)=> {
            sse.send('Something went wrong while sending the file', 'feedback')
            sse.send(error)
          })
        })
        
        .then(()=>{
          // send env vars to client server
        })
        .then(()=>{ // exec all docker commands 
          // ssh.execCommand('/snap/bin/docker image pull alpine').then(function(result) {
          //   console.log('STDOUT: ' + result.stdout)
          //   console.log('STDERR: ' + result.stderr)
          // })
          ssh.exec('/snap/bin/docker image pull alpine', [], {
            // cwd: '/var/www',
            onStdout(chunk) {
              sse.send(chunk.toString('utf8'), 'feedback')
            },
            onStderr(chunk) {
              sse.send( chunk.toString('utf8'), 'feedback')
            },
          })
        }).then(()=>sse.send(`Services updated on client's server`, 'close' ))

        //set status on client / deploy object & return client obj 
        
        return client.view()
      }else return null ;

    
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
      if (client.status==='Deployed') {
        // config within client spec
        sse.send('establishing SSH connexion', 'step')
        ssh.connect({
          host: client.host,
          username: client.userName,
          password: client.password 
        }).then(()=> {
          // send docker-compose.file
          sse.send('Stop services', 'step')
          // stopping docker compose
          ssh.exec('/snap/bin/docker -v', [], {
            // cwd: '/var/www',
            onStdout(chunk) {
              sse.send(chunk.toString('utf8'), 'feedback')
            },
            onStderr(chunk) {
              sse.send( chunk.toString('utf8'), 'feedback')
            },
          })
        }).then(()=>{
          Object.assign(client, {status : "Deployed"}).save()
          sse.send(`Services updated on client's server`, 'success' )
        })
        

        //set status on client / deploy object & return client obj 
        
        // return client.view()
      }else return null ;

    
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
      if (client.status==='Deployed') {
        // config within client spec
        sse.send('Establishing SSH connexion', 'step')
        ssh.connect({
          host: client.host,
          username: client.userName,
          password: client.password 
        // }).then(()=> {
        //   // send docker-compose.file
        //   sse.send('Starting file Transfer', 'step')
        //   // stopping docker compose
        //   ssh.exec('/snap/bin/docker -v', [], {
        //     // cwd: '/var/www',
        //     onStdout(chunk) {
        //       sse.send(chunk.toString('utf8'), 'feedback')
        //     },
        //     onStderr(chunk) {
        //       sse.send( chunk.toString('utf8'), 'feedback')
        //     },
        //   })
        }).then(()=>{
          sse.send('Stopping services', 'step')
          Object.assign(client, {status : "Not deployed"}).save()
          sse.send(`Services stopped on client's server`, 'success' )
        })
        

        //set status on client / deploy object & return client obj 
        
        // return client.view()
      }else return null ;

    
  })
  .then(success(res))
  .catch(next)
  }
