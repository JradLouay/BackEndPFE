import { Module } from '.'

let module

beforeEach(async () => {
  module = await Module.create({ moduleName: 'test', version: 'test', lastUpdate: 'test', description: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = module.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(module.id)
    expect(view.moduleName).toBe(module.moduleName)
    expect(view.version).toBe(module.version)
    expect(view.lastUpdate).toBe(module.lastUpdate)
    expect(view.description).toBe(module.description)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = module.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(module.id)
    expect(view.moduleName).toBe(module.moduleName)
    expect(view.version).toBe(module.version)
    expect(view.lastUpdate).toBe(module.lastUpdate)
    expect(view.description).toBe(module.description)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
