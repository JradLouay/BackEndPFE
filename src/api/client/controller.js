import { success, notFound } from '../../services/response/'
import { Client } from './index'
import { Scheduler } from '../scheduler'
import { Variable } from '../variable'

let fs = require('fs');

export const create = (req, res, next) =>
    {
      const body = {
        ...req.body
      }
      if (req.files.image) {
        body.image = req.files.image[0].path
      }
      if (req.files.file) {
        body.file = req.files.file[0].path
      }

      Client.create(body)
      .then((client) => client.view(true))
      .then(success(res, 201))
      .catch(next)
    }
    

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
    Client.find(query, select, cursor)
    .then((clients) => clients.map((client) => client.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
    Client.findById(params.id)
    .populate('variables')
    .populate('schedulers')
    .populate('deployedModules')
    .then(notFound(res))
    .then((client) => client ? client.view() : null)
    .then(success(res))
    .catch(next)

export const update = (req, res, next) =>{
      const body = {
        ...req.body
      }
      if (req.files.image) {
        body.image = req.files.image[0].path
      }
      if (req.files.file) {
        body.file = req.files.file[0].path
      }
      
    Client.findById(req.params.id)
    .then(notFound(res))
    .then((client) =>{
      if (client) {
        // if(client.file){
        //   fs.unlink(client.file, (err)=>{
        //   // if (err) throw err;
        //   console.log(client.file,' was deleted');
        //   });
        // }
        // if(client.image){
        //   fs.unlink(client.image, (err)=>{
        //   // if (err) throw err;
        //   console.log(client.image,' was deleted');
        //   });
        // 
        return Object.assign(client, body).save()
        
      } else return null
    })
    .then((client) => client ? client.view(true) : null)
    .then(success(res))
    .catch(next)
  }

export const destroy = ({ params }, res, next) =>
    Client.findById(params.id)
    .then(notFound(res))
    .then((client) => {
      if(client){
        // remove the files 
        if(client.file){
          fs.unlink(client.file, (err)=>{
          // if (err) throw err;
          console.log(client.file,' was deleted');
          });
       }
        if(client.image){
          fs.unlink(client.image, (err)=>{
          // if (err) throw err;
          console.log(client.image,' was deleted');
          });
       }
       //delete variables delete schedulers  
      if(client.schedulers){
        client.schedulers.forEach(id => {
        Scheduler.deleteOne({ _id: id }, function (err) {});
       });
      }
      if(client.variables){
         client.variables.forEach(id => {
        Variable.deleteOne({ _id: id }, function (err) {});
       });
      }

      return client.remove()
      }else return null
    })
    .then(success(res, 204))
    .catch(next)


