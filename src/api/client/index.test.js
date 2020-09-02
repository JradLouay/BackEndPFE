import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Client } from '.'

const app = () => express(apiRoot, routes)

let client

beforeEach(async () => {
  client = await Client.create({})
})

test('POST /clients 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/clients`)
    .send({ clientName: 'test', host: 'test', port: 'test', userName: 'test',
     password: 'test', version: 'test', status: 'test'})
  expect(201).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.clientName).toEqual('test')
  expect(body.host).toEqual('test')
  expect(body.port).toEqual('test')
  expect(body.userName).toEqual('test')
  expect(body.password).toEqual('test')
  expect(body.version).toEqual('test')
  expect(body.status).toEqual('test')
})

test('GET /clients S', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /clients/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${client.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(client.id)
})

test('GET /clients/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /clients/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${client.id}`)
    .send({ clientName: 'test', host: 'test', port: 'test', userName: 'test', password: 'test', image: 'test', file: 'test', version: 'test', status: 'test', lastUpdate: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(client.id)
  expect(body.clientName).toEqual('test')
  expect(body.host).toEqual('test')
  expect(body.port).toEqual('test')
  expect(body.userName).toEqual('test')
  expect(body.password).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.file).toEqual('test')
  expect(body.version).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.lastUpdate).toEqual('test')
})

test('PUT /clients/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ clientName: 'test', host: 'test', port: 'test', userName: 'test', password: 'test', image: 'test', file: 'test', version: 'test', status: 'test', lastUpdate: 'test', deployedModules: 'test', variables: 'test', schedulers: 'test' })
  expect(status).toBe(404)
})

test('DELETE /clients/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${client.id}`)
  expect(status).toBe(204)
})

test('DELETE /clients/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
