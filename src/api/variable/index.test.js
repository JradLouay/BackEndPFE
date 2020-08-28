import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import { Client } from '../client'
import routes, { Variable } from '.'

const app = () => express(apiRoot, routes)

let variable
let client
beforeEach(async () => {
  variable = await Variable.create({})
  client = await Client.create({})
})


test('POST /variables 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}/variables/${client.id}`)
    .send({ key: 'test', value: 'test' })
    console.log(' status-----------------------------', status);
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.key).toEqual('test')
  expect(body.value).toEqual('test')
})

test('GET /variables 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /variables/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${variable.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(variable.id)
})

test('GET /variables/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /variables/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${variable.id}`)
    .send({ key: 'test', value: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(variable.id)
  expect(body.key).toEqual('test')
  expect(body.value).toEqual('test')
})

test('PUT /variables/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ key: 'test', value: 'test' })
  expect(status).toBe(404)
})

test('DELETE /variables/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${variable.id}`)
  expect(status).toBe(204)
})

test('DELETE /variables/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
