import { success, notFound } from '../../services/response/'
import { Scheduler } from '.'
import { Client } from '../client'

export const create = ({ bodymen: { body }, params }, res, next) =>{
  const scheduler = new Scheduler(body) ;
  Client.findById(params.clientId)
  .populate('schedulers')
  .then(notFound(res))
  .then((client) => {
    if (client) {
      client.schedulers.push(scheduler);
      scheduler.save();
      return client.save();
    } else null 
  })
  .then((client) => client ? client.view(true) : null)
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
    } else null 
  })
  .then((client) => client ? client.view(true) : null)
  .then(success(res, 201))
  .catch(next)
