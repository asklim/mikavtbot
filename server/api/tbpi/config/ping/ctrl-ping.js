
const { 
    icwd,
    consoleLogger ,
    sendJSONresponse,
    send200Ok,
    send400BadRequest,
    send503ServiceUnavailable,
} = require( '../../../../helpers' );

const log = consoleLogger( 'ctrl-PING:' );

let dbTBot = require( `${icwd}/server/databases` ).getDB();
const User = dbTBot.model( 'User' );

const { bot: mikavbot } = require( `${icwd}/server/telegram-bot` );

const chats = require( `${icwd}/server/helpers/chats-list` );
const {
    uploadTestPhoto,
} = require( `${icwd}/server/actions` );


/** 
 * Read a env variable from process.env by name
 * GET /api/config/ping/app
 * @returns send 200 {message : 'bot'} - is Ok or nothing if bot doesn't work  
 * 
 * GET /api/config/ping/context
 * GET /api/config/ping/mongodb
 * @returns send 200 {message : 'nn'} - count of docs.   
 * @returns send 404 {message : '-1'} - no Mongo
 **/

module.exports.readOne = async (req, res) => {

    //params : {'bot' | 'context' | 'mongo'}
    log.info( 
        'readOne - params:', req && req.params,
        'count:', req && req.params && Object.keys( req.params ).length 
    );

    if( !req || !req.params ) { 
        return send400BadRequest( res, 'No .params in request.' );        
    }
    if( Object.keys( req.params ).length === 0) { // должно быть    
        return send400BadRequest( res, ".params is empty." );        
    }

    const { pingId } = req.params;

    if( !pingId ) {  // req.params.* должен быть    
        return send400BadRequest( res, ".pingId not present" );             
    }

    const ticker = pingId.toLowerCase();

    if( ticker === 'bot' ) {  
        return send200Ok( res, 'bot' );        
    }

    if( ticker === 'context' ) {
        const ctx = {
            token: mikavbot.token,
            apiRoot: mikavbot.telegram.options.apiRoot,
            chat_id: chats.mikafamily.id
        };
        uploadTestPhoto( ctx );
        return sendJSONresponse( 
            res,
            200,
            ctx
        );
    }

    if( ticker === 'mongodb' ) {
        return User
        .countDocuments( {}, 
            (err,count) => {
                if( err ) {
                    return send503ServiceUnavailable( res, '-1' );                
                }            
                return send200Ok( res, count.toString() );                  
            }
        );        
    }

    send400BadRequest( res );
};
