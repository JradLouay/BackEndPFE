import { success, notFound } from '../../services/response/'
import { Deploy } from '.'
let SSE = require('express-sse');
let sse = new SSE();
let NodeSSH = require('node-ssh')
let ssh = new NodeSSH()

export const create = ({ bodymen: { body } }, res, next) =>

    {

        sse.init(req, res)
        Deploy.create(body)
        .then((deploy) =>
        {  
          sse.send(`downloading images`);
          setTimeout(() => {
          sse.send(`Images downloaded`);
          setTimeout(() => {
            sse.send(`running containers`);
            setTimeout(() => {
              sse.send(`containers started`);
              }, 2000);
            }, 1000);
          }, 2000);

            return deploy.view(true)
          }
        )
        .then(success(res, 201))
        .catch(next)
        // ssh.connect({
        //   host: '192.168.1.6',
        //   username: 'louay',
        //   password: 'louayjrad'
        // }).then(()=>{
        //   ssh.execCommand('ls -lh').then(function(result) {
        //     console.log('STDOUT: ' + result.stdout)
        //     console.log('STDERR: ' + result.stderr)
        //   })
        // })
  }

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Deploy.find(query, select, cursor)
    .then((deploys) => deploys.map((deploy) => deploy.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Deploy.findById(params.id)
    .then(notFound(res))
    .then((deploy) => deploy ? deploy.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Deploy.findById(params.id)
    .then(notFound(res))
    .then((deploy) => deploy ? Object.assign(deploy, body).save() : null)
    .then((deploy) => deploy ? deploy.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Deploy.findById(params.id)
    .then(notFound(res))
    .then((deploy) => deploy ? deploy.remove() : null)
    .then(success(res, 204))
    .catch(next)
