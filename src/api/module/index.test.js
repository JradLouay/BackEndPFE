import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Module } from '.'

const app = () => express(apiRoot, routes)

let module

beforeEach(async () => {
  module = await Module.create({})
})

test('POST /modules 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ moduleName: 'test', version: 'test', lastUpdate: 'test', description: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.moduleName).toEqual('test')
  expect(body.version).toEqual('test')
  expect(body.lastUpdate).toEqual('test')
  expect(body.description).toEqual('test')
})

test('GET /modules 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /modules/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${module.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(module.id)
})

test('GET /modules/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /modules/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${module.id}`)
    .send({ moduleName: 'test', version: 'test', lastUpdate: 'test', description: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(module.id)
  expect(body.moduleName).toEqual('test')
  expect(body.version).toEqual('test')
  expect(body.lastUpdate).toEqual('test')
  expect(body.description).toEqual('test')
})

test('PUT /modules/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ moduleName: 'test', version: 'test', lastUpdate: 'test', description: 'test' })
  expect(status).toBe(404)
})

test('DELETE /modules/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${module.id}`)
  expect(status).toBe(204)
})

test('DELETE /modules/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
