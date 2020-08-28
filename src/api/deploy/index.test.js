import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Deploy } from '.'

const app = () => express(apiRoot, routes)

let deploy

beforeEach(async () => {
  deploy = await Deploy.create({})
})

test('POST /deploys 200', async () => {
  const {status, body} = await request(app())
    .post(`${apiRoot}/test`)
    .send({ host: '197.168.1.6', username:'louay', password:'louayjrad' })
  expect(status).toBe(500)
})

test('GET /deploy/:id 201', async () => {
  const {status, body} = await request(app())
    .post(`${apiRoot}/test`)
    .send({ host: '197.168.1.6', username:'louay', password:'louayjrad' })
  expect(status).toBe(500)
})

test('GET /update/:id 201', async () => {
  const {status, body} = await request(app())
    .post(`${apiRoot}/test`)
    .send({ host: '197.168.1.6', username:'louay', password:'louayjrad' })
  expect(status).toBe(500)
})

test('GET /rollback/:id 201', async () => {
  const {status, body} = await request(app())
    .post(`${apiRoot}/test`)
    .send({ host: '197.168.1.6', username:'louay', password:'louayjrad' })
  expect(status).toBe(500)
})

test('GET /stats/:id 201', async () => {
  const {status, body} = await request(app())
    .post(`${apiRoot}/test`)
    .send({ host: '197.168.1.6', username:'louay', password:'louayjrad' })
  expect(status).toBe(500)
})

test('GET /logs/:id/:containerId 201', async () => {
  const {status, body} = await request(app())
    .post(`${apiRoot}/test`)
    .send({ host: '197.168.1.6', username:'louay', password:'louayjrad' })
  expect(status).toBe(500)
})

test('GET /stop/:id 201', async () => {
  const {status, body} = await request(app())
    .post(`${apiRoot}/test`)
    .send({ host: '197.168.1.6', username:'louay', password:'louayjrad' })
  expect(status).toBe(500)
})


  
// test('GET /deploys 200', async () => {
//   const { status, body } = await request(app())
//     .get(`${apiRoot}`)
//   expect(status).toBe(200)
//   expect(Array.isArray(body)).toBe(true)
// })

// test('GET /deploys/:id 200', async () => {
//   const { status, body } = await request(app())
//     .get(`${apiRoot}/${deploy.id}`)
//   expect(status).toBe(200)
//   expect(typeof body).toEqual('object')
//   expect(body.id).toEqual(deploy.id)
// })

// test('GET /deploys/:id 404', async () => {
//   const { status } = await request(app())
//     .get(apiRoot + '/123456789098765432123456')
//   expect(status).toBe(404)
// })

// test('PUT /deploys/:id 200', async () => {
//   const { status, body } = await request(app())
//     .put(`${apiRoot}/${deploy.id}`)
//     .send({ clientId: 'test' })
//   expect(status).toBe(200)
//   expect(typeof body).toEqual('object')
//   expect(body.id).toEqual(deploy.id)
//   expect(body.clientId).toEqual('test')
// })

// test('PUT /deploys/:id 404', async () => {
//   const { status } = await request(app())
//     .put(apiRoot + '/123456789098765432123456')
//     .send({ clientId: 'test' })
//   expect(status).toBe(404)
// })

// test('DELETE /deploys/:id 204', async () => {
//   const { status } = await request(app())
//     .delete(`${apiRoot}/${deploy.id}`)
//   expect(status).toBe(204)
// })

// test('DELETE /deploys/:id 404', async () => {
//   const { status } = await request(app())
//     .delete(apiRoot + '/123456789098765432123456')
//   expect(status).toBe(404)
// })
