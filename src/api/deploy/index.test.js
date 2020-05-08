import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Deploy } from '.'

const app = () => express(apiRoot, routes)

let deploy

beforeEach(async () => {
  deploy = await Deploy.create({})
})

test('POST /deploys 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ clientId: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.clientId).toEqual('test')
})

test('GET /deploys 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /deploys/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${deploy.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(deploy.id)
})

test('GET /deploys/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /deploys/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${deploy.id}`)
    .send({ clientId: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(deploy.id)
  expect(body.clientId).toEqual('test')
})

test('PUT /deploys/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ clientId: 'test' })
  expect(status).toBe(404)
})

test('DELETE /deploys/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${deploy.id}`)
  expect(status).toBe(204)
})

test('DELETE /deploys/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
