import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, test, update, destroy, deploy, rollback } from './controller'
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
  // body({ clientId }),
  create)

/**
 * @api {post} /deploys test client info
 * @apiName CreateDeploy
 * @apiGroup Deploy
 * @apiParam clientId Deploy's clientId.
 * @apiSuccess {Object} deploy Deploy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deploy not found.
 */
router.post('/test',
  // body({ clientId }),
  test)

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
 * @api {get} /deploys/deploy/:id deploy app to client
 * @apiName DeployToClient
 * @apiGroup Deploy
 * @apiParam clientId Deploy's clientId.
 * @apiSuccess {Object} deploy Deploy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deploy not found.
 */
router.get('/deploy/:id',
  deploy)

/**
 * @api {put} /deploys/update/:id Update services deploy
 * @apiName UpdateDeploy
 * @apiGroup Deploy
 * @apiParam clientId Deploy's clientId.
 * @apiSuccess {Object} deploy Deploy's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Deploy not found.
 */
router.get('/update/:id',
  update)

/**
 * @api {delete} /deploys/rollback/:id Stop services deploy
 * @apiName DeleteDeploy
 * @apiGroup Deploy
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Deploy not found.
 */
router.get('/rollback/:id',
rollback)

/**
 * @api {delete} /deploys/stop/:id Stop services deploy
 * @apiName DeleteDeploy
 * @apiGroup Deploy
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Deploy not found.
 */
router.get('/stop/:id',
  destroy)

export default router
