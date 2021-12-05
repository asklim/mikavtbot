
const {
    icwd,
    consoleLogger,
    securefy,
    send200Ok,
    send400BadRequest,
    send500ServerError,
} = require( '../../../helpers' );

const log = consoleLogger( 'api-health:' );

let dbTBot = require( `${icwd}/server/databases` ).getDB();

const { bot: mikavbot } = require( `${icwd}/server/telegram-bot` );

const chatsList = require( `${icwd}/server/helpers/chats-list` );
const {
    uploadTestPhoto,
} = require( `${icwd}/server/actions` );


/**
 * Return status of app or DBs
 * GET /tbpi/health/app
 * @returns send 200 {message : 'bot'} - is Ok or nothing if bot doesn't work
 *
 * GET /tbpi/health/context
 * GET /tbpi/health/database
 * @returns send 200 {ok: true, [dbname] : 'nn'} - count of docs.
 * @returns send 500 {ok: false, [dbname] : undefined} - no Mongo
 **/

module.exports = async function (req, res) {

    //params : {'app' | 'context' | 'database'}
    log.info(
        'handler-GET - params:', req && req.params,
        'count:', req && req.params && Object.keys( req.params ).length
    );

    if( !req || !req.params ) {
        return send400BadRequest( res, 'No .params in request.' );
    }

    const { pingId } = req.params;

    if( !pingId ) {
        return send200Ok( res, 'app' );
    }

    const ticker = pingId.toLowerCase();

    if( ticker == '' || ticker == 'app' ) {
        return send200Ok( res, 'app' );
    }

    if( ticker == 'context' ) {
        const ctx = {
            token: mikavbot.token,
            apiRoot: mikavbot.telegram.options.apiRoot,
            chat_id: chatsList.mikafamily.id
        };
        uploadTestPhoto( ctx );
        return send200Ok( res, securefy( ctx ));
    }


    if( pingId === 'database' ) {

        let maindbCount;
        try {
            maindbCount = await totalDocumentsInDB( dbTBot );
            return send200Ok( res,
                {
                    ok: true,
                    [dbTBot.name]: maindbCount,
                }
            );
        }
        catch {
            return send500ServerError( res,
                {
                    ok: false,
                    [dbTBot.name]: maindbCount,
                }
            );
        }
    }

    send400BadRequest( res, `parameter '${pingId}' is invalid.` );
};




/**
 * @param mongodb - Mongoose.Connection to db
 * @returns count documents in db for all collections
 **/
async function totalDocumentsInDB (mongodb) {

    let total = 0;
    for( let name of mongodb.modelNames() ) {

        let theModel = mongodb.model( name );
        let count = await theModel.estimatedDocumentCount();
        total += count;
    }
    return total;
}
