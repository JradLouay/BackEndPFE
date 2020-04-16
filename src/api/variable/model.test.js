import { Variable } from '.'

let variable

beforeEach(async () => {
  variable = await Variable.create({ key: 'test', value: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = variable.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(variable.id)
    expect(view.key).toBe(variable.key)
    expect(view.value).toBe(variable.value)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = variable.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(variable.id)
    expect(view.key).toBe(variable.key)
    expect(view.value).toBe(variable.value)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
