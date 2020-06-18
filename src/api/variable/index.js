import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, addList, index, show, update, destroy } from './controller'
import { schema } from './model'
export Variable, { schema } from './model'

const router = new Router()
const { key, value } = schema.tree

/**
 * @api {post} /variables/:clientId Create variable for a client 
 * @apiName CreateVariable
 * @apiGroup Variable
 * @apiParam key Variable's key.
 * @apiParam value Variable's value.
 * @apiSuccess {Object} variable Variable's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Variable not found.
 */
router.post('/:clientId',
  body({ key, value }),
  create)
/**
 * @api {post} /variables/addList/:clientId add a list of variables to clientId
 * @apiName CreateVariable
 * @apiGroup Variable
 * @apiParam list of Variables
 * @apiParam key Variable's key.
 * @apiParam value Variable's value.
 * @apiSuccess {Object} variable Variable's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Variable not found.
 */
router.post('/addList/:clientId',
  // body({ key, value }),
  addList)

/**
 * @api {get} /variables Retrieve variables
 * @apiName RetrieveVariables
 * @apiGroup Variable
 * @apiUse listParams
 * @apiSuccess {Object[]} variables List of variables.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /variables/:id Retrieve variable
 * @apiName RetrieveVariable
 * @apiGroup Variable
 * @apiSuccess {Object} variable Variable's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Variable not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /variables/:id Update variable
 * @apiName UpdateVariable
 * @apiGroup Variable
 * @apiParam key Variable's key.
 * @apiParam value Variable's value.
 * @apiSuccess {Object} variable Variable's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Variable not found.
 */
router.put('/:id',
  body({ key, value }),
  update)

/**
 * @api {delete} /variables/:clientId/variableId Delete variable from client
 * @apiName DeleteVariable
 * @apiGroup Variable
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Variable not found.
 */
router.delete('/:clientId/:variableId',
  destroy)

export default router
