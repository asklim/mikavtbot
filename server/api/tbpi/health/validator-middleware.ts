import { Response, Request } from 'express';

import {
    Logger,
    // securifyObjByList,
    // send200Ok,
    // send400BadRequest,
    send500ServerError,
} from '<srv>/helpers/';
const log = new Logger('api-health:');

export default async function reqObjectValidator (
    req: Request,
    res: Response,
    next: () => void | undefined
) {
    if (req && req.params) {
        if ( next ) {
            next();
        }
        else {
            const errMsg = '`next` argument is undefined.';
            send500ServerError( res, errMsg );
            throw new Error( errMsg );
        }
    }
    else {
        log.debug('req', Object.keys( req ).sort());
        // log.debug('res', Object.keys( res ).sort());
        const errMsg = 'No `req.params` property in `req` argument.';
        send500ServerError( res, errMsg );
        throw new Error( errMsg );
    }
}
