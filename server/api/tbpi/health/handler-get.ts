import { Response, Request } from 'express';

import {
    Logger,
    securifyObjByList,
    send200Ok,
    send400BadRequest,
    send500ServerError,
} from '<srv>/helpers/';

import { getDB } from '<srv>/databases/';
import chatsList from '<srv>/helpers/chats-list';
import { uploadTestPhoto } from '<srv>/helpers/upload-photo';

const log = new Logger('api-health:');
const dbTBot = getDB();


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
export default async function (
    req: Request,
    res: Response
) {
    //params : {'app' | 'context' | 'database'}
    log.info(
        'handler-GET - params:', req.params,
        ', count:', req.params && Object.keys( req.params ).length
    );

    if( !req.params ) {
        return send400BadRequest( res, 'No .params in request.');
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

        const ctx = {
            token: req.app.get('BOT_ID_TOKEN'),
            //process.env.MIKAHOMEBOT_TOKEN, //mikavbot.token,
            //apiRoot: mikavbot.telegram.options.apiRoot,
            //apiRoot: 'https://api.telegram.org',
            chat_id: chatsList.andreiklim.id
        };
        uploadTestPhoto( ctx );
        return send200Ok( res, securifyObjByList( { ok: true, ...ctx } ));
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
