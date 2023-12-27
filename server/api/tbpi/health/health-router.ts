import { Router } from 'express';

import { callbackError405 } from '../../../helpers/';

import { default as handlerGET } from './handler-get';
import validator from './validator-middleware';

/**
 * Return status of app or DBs
 * @usage GET /tbpi/health/app
 * @usage GET /tbpi/health/context
 * @usage GET /tbpi/health/databases
 */
export default async function router_api_health (router: Router) {

    //router.all( '/health/', callbackError400 );

    const route = '/health';
    const routeWithId = `${route}/:healthId`;

    router.get( routeWithId, handlerGET );
    router.all( routeWithId, callbackError405 );

    // for '/health' and '/health/' routes
    router.use( validator );
    router.get( route, handlerGET );
    router.all( route, callbackError405 );

}
