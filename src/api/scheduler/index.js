import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Scheduler, { schema } from './model'

const router = new Router()
const { schedulerName, description, date, time, version, type, status } = schema.tree

/**
 * @api {post} /schedulers/:clientId Create scheduler for client 
 * @apiName CreateScheduler
 * @apiGroup Scheduler
 * @apiParam schedulerName Scheduler's schedulerName.
 * @apiParam description Scheduler's description.
 * @apiParam date Scheduler's date.
 * @apiParam time Scheduler's time.
 * @apiParam version Scheduler's version.
 * @apiParam type Scheduler's type.
 * @apiParam status Scheduler's status.
 * @apiSuccess {Object} scheduler Scheduler's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Scheduler not found.
 */
router.post('/:clientId',
  body({ schedulerName, description, date, time, version, type, status }),
  create)

/**
 * @api {get} /schedulers Retrieve schedulers
 * @apiName RetrieveSchedulers
 * @apiGroup Scheduler
 * @apiUse listParams
 * @apiSuccess {Object[]} schedulers List of schedulers.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /schedulers/:id Retrieve scheduler
 * @apiName RetrieveScheduler
 * @apiGroup Scheduler
 * @apiSuccess {Object} scheduler Scheduler's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Scheduler not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /schedulers/:id Update scheduler
 * @apiName UpdateScheduler
 * @apiGroup Scheduler
 * @apiParam schedulerName Scheduler's schedulerName.
 * @apiParam description Scheduler's description.
 * @apiParam date Scheduler's date.
 * @apiParam time Scheduler's time.
 * @apiParam version Scheduler's version.
 * @apiParam type Scheduler's type.
 * @apiParam status Scheduler's status.
 * @apiSuccess {Object} scheduler Scheduler's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Scheduler not found.
 */
router.put('/:id',
  body({ schedulerName, description, date, time, version, type, status }),
  update)

/**
 * @api {delete} /schedulers/:clientId/:schedulerId Delete scheduler
 * @apiName DeleteScheduler
 * @apiGroup Scheduler
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Scheduler not found.
 */
router.delete('/:clientId/:schedulerId',
  destroy)

export default router
