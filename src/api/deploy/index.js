import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Deploy, { schema } from './model'

const router = new Router()
const { clientId } = schema.tree

/**
 * @api {post} /deploys Create deploy
 * @apiName CreateDeploy
 * @apiGroup Deploy
 * @apiParam clientId Deploy's clientId.
 * @apiSuccess {Object} deploy Deploy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deploy not found.
 */
router.post('/',
  body({ clientId }),
  create)

/**
 * @api {get} /deploys Retrieve deploys
 * @apiName RetrieveDeploys
 * @apiGroup Deploy
 * @apiUse listParams
 * @apiSuccess {Object[]} deploys List of deploys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /deploys/:id Retrieve deploy
 * @apiName RetrieveDeploy
 * @apiGroup Deploy
 * @apiSuccess {Object} deploy Deploy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deploy not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /deploys/:id Update deploy
 * @apiName UpdateDeploy
 * @apiGroup Deploy
 * @apiParam clientId Deploy's clientId.
 * @apiSuccess {Object} deploy Deploy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deploy not found.
 */
router.put('/:id',
  body({ clientId }),
  update)

/**
 * @api {delete} /deploys/:id Delete deploy
 * @apiName DeleteDeploy
 * @apiGroup Deploy
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Deploy not found.
 */
router.delete('/:id',
  destroy)

export default router
