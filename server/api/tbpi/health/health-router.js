
const {
    //callbackError400,
    callbackError405,
} = require( '../../../helpers/' );

const handlerGET = require( './handler-get' );


/**
 * Return status of app or DBs
 * @usage GET /tbpi/health/app
 * @usage GET /tbpi/health/context
 * @usage GET /tbpi/health/databases
 */
module.exports = function ( router ) {

    //router.all( '/health/', callbackError400 );

    const route = '/health';
    const routeWithId = `${route}/:pingId`;

    router.get( route, handlerGET );
    router.all( route, callbackError405 );

    router.get( routeWithId, handlerGET );
    router.all( routeWithId, callbackError405 );
};

