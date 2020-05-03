import { Router } from 'express'
import module from './module'
import scheduler from './scheduler'
import variable from './variable'
import client from './client'
import user from './user'
import auth from './auth'

const router = new Router()

router.use('/modules', module)
router.use('/schedulers', scheduler)
router.use('/variables', variable)
router.use('/clients', client)
router.use('/users', user)
router.use('/auth', auth)

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */

export default router
