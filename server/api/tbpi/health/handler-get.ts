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
import { Connection } from 'mongoose';

const log = new Logger('api-health:');

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
export default async function handler_tbpi_health_GET (
    req: Request,
    res: Response
) {
    //params: {} = { healthId: 'app' | 'context' | 'database'}
    try {
        log.info(
            'hGET - req.params:', req?.params,
            ', count:', Object.keys( req?.params ).length
        );

        const { healthId } = req.params;
        const id = healthId?.toLowerCase() ?? 'app';

        if ( id === 'app' ) {
            // throw "health-handler-test-error";
            send200Ok( res,
                {
                    ok: true,
                    message: 'app'
                }
            );
            return;
        }

        if ( id === 'context' ) {

            const ctx = {
                token: req.app.get('BOT_ID_TOKEN'),
                //process.env.MIKAHOMEBOT_TOKEN, //mikavbot.token,
                //apiRoot: mikavbot.telegram.options.apiRoot,
                //apiRoot: 'https://api.telegram.org',
                chat_id: chatsList.andreiklim.id
            };
            uploadTestPhoto( ctx );
            send200Ok( res, securifyObjByList(
                {
                    ok: true,
                    ...ctx
                }
            ));
            return;
        }

        if ( id === 'database' ) {
            const tbotDB = await getDB();
            responseDatabaseHealth( tbotDB, res );
            return;
        }

        send400BadRequest( res, `parameter '${healthId}' is invalid.`);
    }
    catch (err) {
        log.error('catch in health-handler-GET');
        log.trace( err );
        send500ServerError( res, 'Error in health-handler-GET');
    }
}


async function responseDatabaseHealth(
    db: Connection | null | undefined,
    res: Response
) {
    if ( !db ) {
        send500ServerError( res, 'No connection to database.');
        return;
    }

    let maindbCount;
    try {
        maindbCount = await totalDocumentsInDB( db );
        send200Ok( res,
            {
                ok: true,
                [db.name]: maindbCount,
            }
        );
    }
    catch {
        send500ServerError( res,
            {
                ok: false,
                [db.name]: maindbCount,
            }
        );
    }
}


/**
 * @param mongodb - Mongoose.Connection to db
 * @returns count documents in db for all collections
 **/
async function totalDocumentsInDB (mongodb: Connection) {

    let total = 0;
    for (
        const name of mongodb.modelNames()
    ) {
        const theModel = mongodb.model( name );
        const count = await theModel.estimatedDocumentCount();
        total += count;
    }
    return total;
}
