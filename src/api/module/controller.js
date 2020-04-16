import { success, notFound } from '../../services/response/'
import { Module } from '.'
import { Client } from '../client'

export const create = ({ bodymen: { body } }, res, next) =>
    Module.create(body)
    .then((module) => module.view(true))
    .then(success(res, 201))
    .catch(next)


export const addToClient = ({ bodymen: { body }, params }, res, next) =>
      
        Client.findById(params.clientId)
        .then(notFound(res))
        .then((client) => {
          if (client) {
            client.deployedModules.push(params.moduleId);
            return client.save();
          } else null 
        })
        .then((client) => client ? client.view(true) : null)
        .then(success(res, 201))
        .catch(next)
    

export const removeFromClient = ({ params }, res, next) =>
      {
        Client.findById(params.clientId)
        .then(notFound(res))
        .then((client) => {
          if (client) {
            client.deployedModules.remove(params.moduleId);
            return client.save();
          } else null 
        })
        .then((client) => client ? client.view(true) : null)
        .then(success(res, 201))
        .catch(next)
    }


export const index = ({ querymen: { query, select, cursor } }, res, next) =>
    Module.find(query, select, cursor)
    .then((modules) => modules.map((module) => module.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Module.findById(params.id)
    .then(notFound(res))
    .then((module) => module ? module.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Module.findById(params.id)
    .then(notFound(res))
    .then((module) => module ? Object.assign(module, body).save() : null)
    .then((module) => module ? module.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Module.findById(params.id)
    .then(notFound(res))
    .then((module) => module ? module.remove() : null)
    .then(success(res, 204))
    .catch(next)
