import { Scheduler } from '.'

let scheduler

beforeEach(async () => {
  scheduler = await Scheduler.create({ schedulerName: 'test', description: 'test', date: 'test', time: 'test', version: 'test', type: 'test', status: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = scheduler.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(scheduler.id)
    expect(view.schedulerName).toBe(scheduler.schedulerName)
    expect(view.description).toBe(scheduler.description)
    expect(view.date).toBe(scheduler.date)
    expect(view.time).toBe(scheduler.time)
    expect(view.version).toBe(scheduler.version)
    expect(view.type).toBe(scheduler.type)
    expect(view.status).toBe(scheduler.status)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = scheduler.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(scheduler.id)
    expect(view.schedulerName).toBe(scheduler.schedulerName)
    expect(view.description).toBe(scheduler.description)
    expect(view.date).toBe(scheduler.date)
    expect(view.time).toBe(scheduler.time)
    expect(view.version).toBe(scheduler.version)
    expect(view.type).toBe(scheduler.type)
    expect(view.status).toBe(scheduler.status)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
