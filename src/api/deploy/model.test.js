import { Deploy } from '.'

let deploy

beforeEach(async () => {
  deploy = await Deploy.create({ clientId: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = deploy.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(deploy.id)
    expect(view.clientId).toBe(deploy.clientId)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = deploy.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(deploy.id)
    expect(view.clientId).toBe(deploy.clientId)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
