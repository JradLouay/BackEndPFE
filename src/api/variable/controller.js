import { success, notFound } from '../../services/response/'
import { Variable } from '.'
import { Client }  from '../client' 

export const create = ({ bodymen: { body }, params }, res, next) =>
{
    const variable = new Variable(body);
    Client.findById(params.clientId)
    .populate('variables')
    .then(notFound(res))
    .then((client) => {
      if (client) {
        client.variables.push(variable); 
        variable.save();
        return client.save();
      } else return null 
    })
    .then((client) => client ? client.view(true) : null)
    .then(success(res, 201))
    .catch(next)
}

export const addList = (req, res, next) =>
{   
    Client.findById(req.params.clientId)
    .populate('variables')
    .then(notFound(res))
    .then((client) => {
      if (client) {
        for (const key in req.body) {
          const variable = new Variable({ key : key, value : req.body[key]});
          client.variables.push(variable); 
          variable.save();
        }
        return client.save();
      } else return null 
    })
    .then((client) => client ? client.view(true) : null)
    .then(success(res, 201))
    .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Variable.find(query, select, cursor)
    .then((variables) => variables.map((variable) => variable.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Variable.findById(params.id)
    .then(notFound(res))
    .then((variable) => variable ? variable.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
    Variable.findById(params.id)
    .then(notFound(res))
    .then((variable) => variable ? Object.assign(variable, body).save() : null)
    .then((variable) => variable ? variable.view(true) : null)
    .then(success(res))
    .catch(next)
    

export const destroy = ({ params }, res, next) =>
        Client.findById(params.clientId)
        .then(notFound(res))
        .then((client) => {
          if (client) {
            client.variables.remove(params.variableId);
            Variable.deleteOne({ _id: params.variableId }, function (err) {});
            return client.save();
          } else return null 
        })
        .then((client) => client ? client.view(true) : null)
        .then(success(res, 201))
        .catch(next)
