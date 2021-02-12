
const {
    callbackError400,
    callbackError405,
} = require( '../../../../helpers' );

const { readOne } = require( './ctrl-ping' );


/**  
 * Read a env variable from process.env by name
 * GET /tbpi/config/ping/bot
 * GET /tbpi/config/ping/context
 * GET /tbpi/config/ping/mongodb
 */
module.exports = function ( router ) {

    router.all( '/config/ping/', callbackError400 );

    let pingPath = '/config/ping/:pingId';
    
    router.get( pingPath, readOne );
    router.post( pingPath, callbackError405 );
    router.put( pingPath, callbackError405 );
    router.delete( pingPath, callbackError405 );
  
};

