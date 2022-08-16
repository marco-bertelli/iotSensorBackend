import { Router } from 'express';
import { readdirSync, statSync } from 'fs';
import path from 'path';

const router = new (Router as any)();

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header to access this endpoint.
 **/
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header to access this endpoint.
 **/
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header to access this endpoint.
 **/
/**
 * @apiDefine listParams
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 * @apiParam {String[fieldName]} [singleFieldValue] filter by element value.
 **/

/**
 * Generate API routes based on folders
 *  (exclude folder starting with '_')
 */
readdirSync(__dirname)
	.filter(f => !f.startsWith('_'))
	.map(f => ({
		name: f,
		module: path.join(__dirname, f)
	}))
	.filter(a => statSync(a.module).isDirectory())
	.forEach(a => {
		router.use(`/${a.name}`, require(a.module).default);
	});

/**
 * Route for healthcheck
 */
router.get('/healthcheck', (req: any, res: { sendStatus: (arg0: number) => any; }) => res.sendStatus(200));

export default router;
