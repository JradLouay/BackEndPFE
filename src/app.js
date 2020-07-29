import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
const logPlugin = require('./services/logger/plugin')
mongoose.plugin(logPlugin)
import express from './services/express'
import api from './api'

if (mongo.uri) {
  mongoose.connect(mongo.uri)
}
mongoose.Promise = Promise


const app = express(apiRoot, api)
const server = http.createServer(app)


setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

export default app
