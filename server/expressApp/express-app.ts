import express, {
    Express,
    Response
} from 'express';

import {
    debugFactory,
    httpResponseCodes as HTTP,
    send200Ok,
    send201Created,
    send204NoContent,
    send400BadRequest,
    send404NotFound,
    send500ServerError,
} from '<srv>/helpers/';

import {
    Logger,
    IConsoleLogger
} from '<srv>/helpers/';

const debug = debugFactory('app:express');
const defaultLogger = new Logger('[app:express]');


export type AppResponse = Response | Error;

export type AppLogicResponse = {
    statusCode: number;
    logMessage: string;
    response: AppResponse;
}

// eslint-disable-next-line no-unused-vars
export type HandlerFn = (res: AppLogicResponse) => void;

interface ExpressApp extends Express {
    logger: unknown;
    startTimestamp: number | undefined;
    getStartTime: () => number | undefined;
    // eslint-disable-next-line no-unused-vars
    getStateHandler: (r: Response, l?: IConsoleLogger) => HandlerFn;
}

const app = <ExpressApp> express();

app.logger = defaultLogger;
app.startTimestamp = Date.now();
app.getStartTime = function () { return this.startTimestamp;};

debug('app(define).getStartTime:', app.getStartTime() );
//debug('app(define).logger is', ({}).hasOwnProperty.call( app, 'logger'));


app.getStateHandler = function getStateHandler(
    res: Response,
    logger: IConsoleLogger = defaultLogger
) {
    const STATE_HANDLERS: {[key:number]: HandlerFn} = {

        [HTTP.OK]: (result: AppLogicResponse) => {
            logger.info( result.logMessage );
            return send200Ok( res, result.response );
        },

        [HTTP.CREATED]: (result: AppLogicResponse) => {
            logger.info( result.logMessage );
            return send201Created( res, result.response );
        },

        [HTTP.NO_CONTENT]: (result: AppLogicResponse) => {
            logger.info( result.logMessage );
            //debug( '[h-DELETE]:', result.response );
            //TODO: Client не получает тело json-ответа
            return send204NoContent( res, result.response );
        },

        [HTTP.BAD_REQUEST]: (result: AppLogicResponse) => {
            logger.warn( result.logMessage );
            return send400BadRequest( res, result.response );
        },

        [HTTP.NOT_FOUND]: (result: AppLogicResponse) => {
            logger.warn( result.logMessage );
            return send404NotFound( res, result.response );
        },

        [HTTP.INTERNAL_SERVER_ERROR]: (result: AppLogicResponse) => {
            const { logMessage, response } = result;
            // debug( 'typeof response is', typeof result.response );// 'object'
            // debug( Object.keys( result.response )); // []
            // debug( 'response instanceof Error', response instanceof Error ); //true
            // debug( response );
            logger.error( logMessage );
            // debug( 'err.name:', err.name );
            // debug( 'err.message:', err.message );
            // debug( 'err.toString():', err.toString() );
            const { stack } = <Error> response;
            const len = stack?.split('\n').length;
            logger.debug( `err.stack (${len}):`, stack );
            return send500ServerError( res, response );
        }
    };

    function handler (appLogicResult: AppLogicResponse) {
        // throw new Error( `Test ERROR in Handler.`);
        const { statusCode } = appLogicResult;

        if( statusCode in STATE_HANDLERS ) {
            return STATE_HANDLERS[ statusCode ]( appLogicResult );
        }
        throw new Error( `Handler of ${statusCode} not implemented.`);
    }

    return handler;
};

export default app;
