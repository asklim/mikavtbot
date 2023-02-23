//const debug = require( 'debug' )( 'api:health:[h-GET]' );
const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'icwd'.
    icwd,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securefy'.
    securefy,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'send200Ok'... Remove this comment to see the full error message
    send200Ok,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'send400Bad... Remove this comment to see the full error message
    send400BadRequest,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'send500Ser... Remove this comment to see the full error message
    send500ServerError,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( '../../../helpers/' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'api-health:' );

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const dbTBot = require( `${icwd}/server/databases/` ).getDB();

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const chatsList = require( `${icwd}/server/helpers/chats-list.js` );
const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uploadTest... Remove this comment to see the full error message
    uploadTestPhoto,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( `${icwd}/server/helpers/upload-photo.js` );


/**
 * Return status of app or DBs
 * GET /tbpi/health/app
 * @returns send 200 {message : 'app'} - is Ok or nothing if bot doesn't work
 *
 * GET /tbpi/health/context
 * GET /tbpi/health/database
 * @returns send 200 {ok: true, [dbname] : 'nn'} - count of docs.
 * @returns send 500 {ok: false, [dbname] : undefined} - no Mongo
 **/

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function (
    req: any,
    res: any
) {
    //params : {'app' | 'context' | 'database'}
    log.info(
        'handler-GET - params:', req.params,
        ', count:', req.params && Object.keys( req.params ).length
    );

    if( !req.params ) {
        return send400BadRequest( res, 'No .params in request.' );
    }

    const { pingId } = req.params;

    if( !pingId ) {
        return send200Ok( res, {
            ok: true,
            message: 'app'
        });
    }

    const ticker = pingId.toLowerCase();

    if( ticker == '' || ticker == 'app' ) {
        return send200Ok( res, {
            ok: true,
            message: 'app'
        });
    }

    if( ticker == 'context' ) {

        //const { mikavbot } = require( `${icwd}/server/app.js` );
        //debug( 'mikavbot is', mikavbot );

        const ctx = {
            token: req.app.get( 'BOT_ID_TOKEN' ),
            //process.env.MIKAHOMEBOT_TOKEN, //mikavbot.token,
            //apiRoot: mikavbot.telegram.options.apiRoot,
            //apiRoot: 'https://api.telegram.org',
            chat_id: chatsList.andreiklim.id
        };
        uploadTestPhoto( ctx );
        return send200Ok( res, securefy( { ok: true, ...ctx } ));
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
async function totalDocumentsInDB (mongodb: any) {

    let total = 0;
    for( let name of mongodb.modelNames() ) {

        let theModel = mongodb.model( name );
        let count = await theModel.estimatedDocumentCount();
        total += count;
    }
    return total;
}
