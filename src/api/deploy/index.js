import { Router } from 'express'
import { create, index, show, test, update, destroy, deploy, rollback, stats } from './controller'
import { token } from '../../services/passport'
// import { schema } from './model'
export Deploy, { schema } from './model'

const router = new Router()
// const { clientId } = schema.tree

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
  // token({ required: true }),
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
// token({ required: true }),
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
// token({ required: true }),
rollback)

/**
 * @api {delete} /deploys/stop/:id Get service Info
 * @apiName Info
 * @apiGroup Info
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Deploy not found.
 */
router.get('/stats/:id',
  stats)

/**
 * @api {delete} /deploys/stop/:id Stop services deploy
 * @apiName DeleteDeploy
 * @apiGroup Deploy
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Deploy not found.
 */
router.get('/stop/:id',
// token({ required: true }),
  destroy)

export default router
