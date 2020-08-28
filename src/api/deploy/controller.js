import { success, notFound } from '../../services/response/'
import { Deploy } from '.'
import { Client } from '../client'
import { 
connect, 
fileTransfer,
envFile, 
composeUp, 
composeDown, 
composeUpdate, 
composePs, 
envFileRollback,
containerLogs } from './steps';
import Activity from '../../services/logger/Activity'
import SSE from 'express-sse';
import NodeSSH from 'node-ssh';
let sse = new SSE();
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
  }).catch((err) => {
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
  console.log("request...... :", req.user);
  sse.init(req, res)
  Client.findById(req.params.id)
    .populate('variables')
    .then(notFound(res))
    .then((client) => {
        sse.send('Establishing SSH connexion', 'step');
        connect(
          client.host,
          client.userName,
          client.password
        )
        .then(() => {
          return fileTransfer(client.file, sse)
        })
        .then(() => {
           return envFile(client.variables, sse);
        })
        .then(() => {
          return composeUp(sse)
        })
        .then((res) => {
          sse.send('Demployment process finished', 'step')
          client.variables.find(element => element.key === "VERSION") ? Object.assign(client, {
            status: "Deployed",
            version: client.variables.find(element => element.key === "VERSION").value
          }).save() : (
                        Object.assign(client, {
                        status: "Deployed"
                        }).save(),
                        sse.send(`VERSION variable not found`, 'feedback')
                        )
          sse.send(`Services are running on client's server`, 'success')
        })
        .catch((err)=>{
          console.log('ERROR FROM :', err);
        })
    })
    .then(async (client)=>{
      await new Activity()
      .performedOn(client)
      .causedBy(req.user ? req.user : undefined)
      .log('Deploy ')
      return client
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
        // config within client spec
        sse.send('establishing SSH connexion', 'step')
        connect(
          client.host,
          client.userName,
          client.password
        )
        .then(() => {
          return fileTransfer(client.file, sse)
        })
        .then(() => {
           return envFile(client.variables, sse);
        })
        .then(() => {
          // docker image prune -a // remove all unreferenced images 
          return composeUpdate(sse)
        })
        .then((res) => {
          sse.send('Demployment process finished', 'step')
          client.variables.find(element => element.key === "VERSION") ? Object.assign(client, {
            status: "Deployed",
            version: client.variables.find(element => element.key === "VERSION").value,
            prevVersion: client.version
          }).save() : (
                        Object.assign(client, {
                        status: "Deployed"
                        }).save(),
                        sse.send(`VERSION variable not found`, 'feedback')
                        )
          sse.send(`Services are running on client's server`, 'success')
        })
        .catch((err)=>{
          console.log('ERROR FROM :', err);
          // send error to client
        })
    })
    .then(async (client)=>{
      await new Activity()
      .performedOn(client)
      .causedBy(req.user ? req.user : undefined)
      .log('Deploy ')
    })
    .then(success(res))
    .catch(next)

}
export const rollback = (req, res, next) =>{
  
  sse.init(req, res)
  Client.findById(req.params.id)
    .populate('variables')
    .then(notFound(res))
    .then((client) => {
        // config within client spec
        sse.send('establishing SSH connexion', 'step')
        connect(
          client.host,
          client.userName,
          client.password
        )
        .then(() => {
          return fileTransfer(client.file, sse)
        })
        .then(() => {
           return envFileRollback(client.variables, sse, client.prevVersion);
        })
        .then(() => {
          // docker image prune -a // remove all unreferenced images 
          return composeUp(sse)
        })
        .then((res) => {
          sse.send('Demployment process finished', 'step')
          const version = client.prevVersion ;

          Object.assign(client, {
              status: "Deployed",
              version: version,
              prevVersion: undefined
            }).save();
          sse.send(`Services are running on client's server`, 'success')
        })
        .catch((err)=>{
          console.log('ERROR FROM :', err);
        })
    })
    .then(success(res))
    .then(async (client)=>{
      await new Activity()
      .performedOn(client)
      .causedBy(req.user ? req.user : undefined)
      .log('Deploy ')
    })
    .catch(next)
}

export const stats = (req, res, next) =>
{ 
  console.log('start stats process');
  Client.findById(req.params.id)
    .then(notFound(res))
    .then((client) => {
      if (client.status == "Deployed" ) {
        // config within client spec
        connect(
          client.host,
          client.userName,
          client.password
        ).then(() => {
          return composePs()
        })
        .then(success(res))
      } else{
        res.status(404).end()
         return null
        }
    })
    .catch(next)
}

export const logs = (req, res, next) =>
{
  console.log("container :", req.params.containerId);
  Client.findById(req.params.id)
    .then(notFound(res))
    .then((client) => {
      if (client.status == "Deployed" ) {
        // config within client spec
        connect(
          client.host,
          client.userName,
          client.password
        ).then(() => {
          return containerLogs(req.params.containerId)
        })
        .then(success(res))
      } else return null;
    })
    .catch(next)
}
export const destroy = (req, res, next) =>
{
  sse.init(req, res)
  sse.send('Stopping process started', 'step')
  Client.findById(req.params.id)
    .then(notFound(res))
    .then((client) => {
      if (client.status === 'Deployed') {
        // config within client spec
        sse.send('Establishing SSH connexion', 'step')
        connect(
          client.host,
          client.userName,
          client.password
        ).then(() => {
          return composeDown(sse)
        }).then(() => {
          sse.send('Stopping services', 'step')
          Object.assign(client, { status: "Not deployed" }).save()
          sse.send(`Services stopped on client's server`, 'success')
        })
      } else return null;
    })
    .then(success(res))
    .then(async (client)=>{
      await new Activity()
      // .performedOn(client)
      .causedBy(req.user ? req.user : undefined)
      .log('Deploy ')
    })
    .catch(next)
}
