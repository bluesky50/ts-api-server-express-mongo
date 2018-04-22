import { Application } from 'express';
import serverConfig from '../configs/serverConfig';
import BasicController from '../classes/BasicController';
import buildStandardRouter from './buildStandardRouter';

const debug = require('debug')(`${serverConfig.appName}:server`);

import CollectionAdapter from '../classes/CollectionAdapter'

/**
 * A function that adds routes to the express.App based on the routeConfig specification.
 * @param app 
 * @param routeConfig 
 */
function buildRoutes(app: Application, routeConfig: any): void {
	if (routeConfig.route || routeConfig.controller) {
		if (routeConfig.type !== 'standard' && routeConfig.useBuilder && typeof(routeConfig.builder) === 'function') {
			app.use(routeConfig.route, routeConfig.builder(routeConfig.controller)); 
		} else if (routeConfig.type === 'standard') {
			// ts-node can't resolve routeConfig.route property without assigning a type.
			const r: string = routeConfig.route;
			app.use(r, buildStandardRouter(routeConfig.controller));
		} else {
			// Necessary information not on config.
			debug(`Route configuration info not suitable for creation of ${routeConfig.routes} endpoints`);
		}
	} else {
		debug(`Route configuration info not not found.`);
	}
}

export default buildRoutes;