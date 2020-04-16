import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Scheduler } from '.'

const app = () => express(apiRoot, routes)

let scheduler

beforeEach(async () => {
  scheduler = await Scheduler.create({})
})

test('POST /schedulers 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ schedulerName: 'test', description: 'test', date: 'test', time: 'test', version: 'test', type: 'test', status: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.schedulerName).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.date).toEqual('test')
  expect(body.time).toEqual('test')
  expect(body.version).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.status).toEqual('test')
})

test('GET /schedulers 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /schedulers/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${scheduler.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(scheduler.id)
})

test('GET /schedulers/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /schedulers/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${scheduler.id}`)
    .send({ schedulerName: 'test', description: 'test', date: 'test', time: 'test', version: 'test', type: 'test', status: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(scheduler.id)
  expect(body.schedulerName).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.date).toEqual('test')
  expect(body.time).toEqual('test')
  expect(body.version).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.status).toEqual('test')
})

test('PUT /schedulers/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ schedulerName: 'test', description: 'test', date: 'test', time: 'test', version: 'test', type: 'test', status: 'test' })
  expect(status).toBe(404)
})

test('DELETE /schedulers/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${scheduler.id}`)
  expect(status).toBe(204)
})

test('DELETE /schedulers/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
