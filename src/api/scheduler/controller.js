import { success, notFound } from '../../services/response/'
import { Scheduler } from '.'
import { Client } from '../client'

import { connect, fileTransfer, envFile, composeUpdate } from '../deploy/steps';

// import SSE from 'express-sse';
import NodeSSH from 'node-ssh';
// let sse = new SSE();
let ssh = new NodeSSH();

var schedule = require('node-schedule');

export const create = ({ bodymen: { body }, params }, res, next) =>{
  const scheduler = new Scheduler(body);
  Client.findById(params.clientId)
  .populate('schedulers')
  .populate('variables')
  .then(notFound(res))
  .then((client) => {
    if (client) {
      client.schedulers.push(scheduler);
      scheduler.save(); 
      return client.save();
    } else return null 
  })
  .then((client) =>{
    if (client) {
        schedule.scheduleJob(scheduler.id, new Date(scheduler.date), ()=>{
        connect(
          client.host,
          client.userName,
          client.password
        )
        .then(() => {
          return fileTransfer(client.file)
        })
        .then(() => {
          //  return null;
           return envFile(client.variables);
        })
        .then(() => {
          return composeUpdate()
        })
        .then((res) => {
          client.variables.find(element => element.key === "VERSION") ? Object.assign(client, {
            status: "Deployed",
            version: client.variables.find(element => element.key === "VERSION").value
          }).save() : (
                        Object.assign(client, {
                        status: "Deployed"
                        }).save()
                        )
          Scheduler.findById(scheduler.id)
          .then(notFound(res))
          .then((scheduler) => scheduler ? Object.assign(scheduler, {status : "Deployed"}).save() : null)
          console.log("scheduler executed")
        })
        .catch((err)=>{
          console.log('ERROR FROM :', err);
        Scheduler.findById(scheduler.id)
        .then(notFound(res))
        .then((scheduler) => scheduler ? Object.assign(scheduler, {status : "Error", feedBack: err}).save() : null)
        })
       
      });
      return  client.view(true)
    }else return null
  })
  .then(success(res, 201))
  .catch(next)
  
}
  

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Scheduler.find(query, select, cursor)
    .then((schedulers) => schedulers.map((scheduler) => scheduler.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Scheduler.findById(params.id)
    .then(notFound(res))
    .then((scheduler) => scheduler ? scheduler.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Scheduler.findById(params.id)
    .then(notFound(res))
    .then((scheduler) => scheduler ? Object.assign(scheduler, body).save() : null)
    .then((scheduler) => scheduler ? scheduler.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  
  Client.findById(params.clientId)
  .then(notFound(res))
  .then((client) => {
    if (client) {
      client.schedulers.remove(params.schedulerId);
      Scheduler.deleteOne({ _id: params.schedulerId }, function (err) {});
      return client.save();
    } else return null 
  })
  .then((client) =>{
    if (client) {
      schedule.scheduledJobs[params.schedulerId].cancel();  // delete Job
      return  client.view(true)
    }else return null
  } )
  .then(success(res, 201))
  .catch(next)
