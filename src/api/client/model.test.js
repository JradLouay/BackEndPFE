import { Client } from '.'

let client

beforeEach(async () => {
  client = await Client.create({ clientName: 'test', host: 'test', port: 'test', userName: 'test', password: 'test', image: 'test', file: 'test', version: 'test', lastUpdate: 'test'})
})

describe('view', () => {
  it('returns simple view', () => {
    const view = client.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(client.id)
    expect(view.clientName).toBe(client.clientName)
    expect(view.host).toBe(client.host)
    expect(view.port).toBe(client.port)
    expect(view.userName).toBe(client.userName)
    expect(view.password).toBe(client.password)
    expect(view.image).toBe(client.image)
    expect(view.file).toBe(client.file)
    expect(view.version).toBe(client.version)
    expect(view.status).toBe(client.status)
    expect(view.lastUpdate).toBe(client.lastUpdate)
    expect(view.deployedModules).toBe(client.deployedModules)
    expect(view.variables).toBe(client.variables)
    expect(view.schedulers).toBe(client.schedulers)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = client.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(client.id)
    expect(view.clientName).toBe(client.clientName)
    expect(view.host).toBe(client.host)
    expect(view.port).toBe(client.port)
    expect(view.userName).toBe(client.userName)
    expect(view.password).toBe(client.password)
    expect(view.image).toBe(client.image)
    expect(view.file).toBe(client.file)
    expect(view.version).toBe(client.version)
    expect(view.status).toBe(client.status)
    expect(view.lastUpdate).toBe(client.lastUpdate)
    expect(view.deployedModules).toBe(client.deployedModules)
    expect(view.variables).toBe(client.variables)
    expect(view.schedulers).toBe(client.schedulers)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
