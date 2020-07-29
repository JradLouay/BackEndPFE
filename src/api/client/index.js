import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Client, { schema } from './model'
// import * as fs from "fs";
// import YAML from 'yaml';
// import formidable from 'formidable';


// Get document, or throw exception on error

const multer = require('multer');

// order is important files must stay at the end of form-data
// const form = formidable({ multiples: true });
const storage = multer.diskStorage({

    destination : function (req, file, cb) {
      if (file.fieldname === "image") {
        cb(null, './image/');
      } else {
        cb(null, './file/'); 
      }
    },
    filename:function (req, file, cb) {
      if (file.fieldname === "file" && req.body.fileName) {
        cb(null, req.body.fileName);
      } else {
        cb(null, file.originalname);
      } 
    }
});

const upload = multer({ storage: storage });
const router = new Router()

const { clientName, host, port, userName, password, image , file, version, status, lastUpdate, deployedModules, variables, schedulers, fileName, prevVersion } = schema.tree

/**
 * @api {post} /clients Create client Ps: order is important files must be at the end
 * @apiName CreateClient
 * @apiGroup Client
 * @apiParam clientName Client's clientName.
 * @apiParam host Client's host.
 * @apiParam port Client's port.
 * @apiParam userName Client's userName.
 * @apiParam password Client's password.
 * @apiParam image Client's image.
 * @apiParam file Client's file.
 * @apiParam version Client's version.
 * @apiParam status Client's status.
 * @apiParam lastUpdate Client's lastUpdate.
 * @apiParam deployedModules Client's deployedModules.
 * @apiParam variables Client's variables.
 * @apiParam schedulers Client's schedulers.
 * @apiSuccess {Object} client Client's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Client not found.
 */
router.post('/',
  upload.fields([{name: 'image'},{name: 'file'}]),
  body({ clientName, host, port, userName, password, image, file, version, status, lastUpdate }),
  token({ required: true, roles: ['admin'] }),
  create)

/**
 * @api {get} /clients Retrieve clients
 * @apiName RetrieveClients
 * @apiGroup Client
 * @apiUse listParams
 * @apiSuccess {Object[]} clients List of clients.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /clients/:id Retrieve client
 * @apiName RetrieveClient
 * @apiGroup Client
 * @apiSuccess {Object} client Client's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Client not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /clients/:id Update client Ps: order is important files must be at the end 
 * @apiName UpdateClient
 * @apiGroup Client
 * @apiParam clientName Client's clientName.
 * @apiParam host Client's host.
 * @apiParam port Client's port.
 * @apiParam userName Client's userName.
 * @apiParam password Client's password.
 * @apiParam image Client's image.
 * @apiParam file Client's file.
 * @apiParam version Client's version.
 * @apiParam status Client's status.
 * @apiParam lastUpdate Client's lastUpdate.
 * @apiParam deployedModules Client's deployedModules.
 * @apiParam variables Client's variables.
 * @apiParam schedulers Client's schedulers.
 * @apiSuccess {Object} client Client's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Client not found.
 */
router.put('/:id',
  upload.fields([{name: 'image'},{name: 'file'}]),
  body({ clientName, host, port, userName, password, image, file, version, status, lastUpdate })
  ,update)

/**
 * @api {delete} /clients/:id Delete client
 * @apiName DeleteClient
 * @apiGroup Client
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Client not found.
 */
router.delete('/:id',
  destroy)

export default router
