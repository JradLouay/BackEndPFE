import { success, notFound } from '../../services/response/'
import { Client } from './index'

// const fs = require('fs');


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
    .populate('variables')
    .populate('schedulers')
    .populate('deployedModules')
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
    .then((client) => client ? Object.assign(client, body).save() : null)
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
        client.remove()
      }else null
    })
    .then(success(res, 204))
    .catch(next)


