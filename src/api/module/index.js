import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy, addToClient, removeFromClient, undeployedModules } from './controller'
import { schema } from './model'
export Module, { schema } from './model'

const router = new Router()
const { moduleName, version, lastUpdate, description } = schema.tree

/**
 * @api {post} /modules Create module
 * @apiName CreateModule
 * @apiGroup Module
 * @apiParam moduleName Module's moduleName.
 * @apiParam version Module's version.
 * @apiParam lastUpdate Module's lastUpdate.
 * @apiParam description Module's description.
 * @apiSuccess {Object} module Module's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Module not found.
 */
router.post('/',
  body({ moduleName, version, lastUpdate, description }),
  create)

/**
 * @api {post} /modules/:clientId/:moduleId add module to client 
 * @apiName AddModuleToCLient
 * @apiGroup Module
 * @apiSuccess {Object} module Module's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Module not found.
 */
router.post('/:clientId/:moduleId',
  body({}),
  addToClient)

/**
 * @api {get} /modules Retrieve modules
 * @apiName RetrieveModules
 * @apiGroup Module
 * @apiUse listParams
 * @apiSuccess {Object[]} modules List of modules.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)
/**
 * @api {get} /modules/clientId Retrieve filtredModules
 * @apiName RetrieveFiltredModules
 * @apiGroup Module
 * @apiUse listParams
 * @apiSuccess {Object[]} modules List of modules.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/:clientId',
  query(),
  undeployedModules)

/**
 * @api {get} /modules/:id Retrieve module
 * @apiName RetrieveModule
 * @apiGroup Module
 * @apiSuccess {Object} module Module's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Module not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /modules/:id Update module
 * @apiName UpdateModule
 * @apiGroup Module
 * @apiParam moduleName Module's moduleName.
 * @apiParam version Module's version.
 * @apiParam lastUpdate Module's lastUpdate.
 * @apiParam description Module's description.
 * @apiSuccess {Object} module Module's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Module not found.
 */
router.put('/:id',
  body({ moduleName, version, lastUpdate, description }),
  update)

/**
 * @api {delete} /modules/:id Delete module
 * @apiName DeleteModule
 * @apiGroup Module
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Module not found.
 */
router.delete('/:id',
  destroy)

/**
 * @api {delete} /modules/:clientId/:moduleId Delete module from client
 * @apiName DeleteModule
 * @apiGroup Module
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Module not found.
 */
router.delete('/:clientId/:moduleId',
  removeFromClient)

export default router
