
const {
    //callbackError400,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'callbackEr... Remove this comment to see the full error message
    callbackError405,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( '../../../helpers/' );

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const handlerGET = require( './handler-get' );


/**
 * Return status of app or DBs
 * @usage GET /tbpi/health/app
 * @usage GET /tbpi/health/context
 * @usage GET /tbpi/health/databases
 */
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function ( router: any ) {

    //router.all( '/health/', callbackError400 );

    const route = '/health';
    const routeWithId = `${route}/:pingId`;

    router.get( route, handlerGET );
    router.all( route, callbackError405 );

    router.get( routeWithId, handlerGET );
    router.all( routeWithId, callbackError405 );
};

