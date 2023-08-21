import { Response, Request } from 'express';
import { default as HTTP } from './http-response-codes';


type ResponseMessage = object | string;

/**
 * Send content as 'object' ONLY.
 * @param {*} res
 * @param {*} status
 * @param {*} content
 */
export function sendJSONresponse (
    res: Response,
    status: number,
    content: ResponseMessage = 'response'
) {
    const response = typeof content === 'object' ?
        content
        : { 'message': content };
    res.status( status ).json( response );
}


export function send200Ok (
    res: Response,
    msg: ResponseMessage = 'OK'
) {
    sendJSONresponse( res, HTTP.OK, msg );
}

export function send201Created (
    res: Response,
    msg: ResponseMessage = 'CREATED'
) {
    sendJSONresponse( res, HTTP.CREATED, msg );
}

export function send204NoContent (
    res: Response,
    msg: ResponseMessage = 'NO_CONTENT'
) {
    sendJSONresponse( res, HTTP.NO_CONTENT, msg );
}

export function send400BadRequest (
    res: Response,
    msg: ResponseMessage = 'BAD_REQUEST (invalid syntax)'
) {
    sendJSONresponse( res, HTTP.BAD_REQUEST, msg );
}

export function send401UnAuthorized (
    res: Response,
    msg: ResponseMessage = 'UnAuthorized'
) {
    sendJSONresponse( res, HTTP.UNAUTHORIZED, msg );
}

export function send404NotFound (
    res: Response,
    msg: ResponseMessage = 'NOT_FOUND'
) {
    sendJSONresponse( res, HTTP.NOT_FOUND, msg );
}

// Метод запроса не разрешен к использованию для данного URL
export function send405MethodNotAllowed (
    res: Response,
    msg: ResponseMessage = 'METHOD_NOT_ALLOWED'
) {
    sendJSONresponse( res, HTTP.METHOD_NOT_ALLOWED, msg );
}

export function send409Conflict (
    res: Response,
    msg: ResponseMessage = 'CONFLICT'
) {
    sendJSONresponse( res, HTTP.CONFLICT, msg );
}

export function send500ServerError (
    res: Response,
    msg: ResponseMessage = 'INTERNAL_SERVER_ERROR'
) {
    sendJSONresponse( res, HTTP.INTERNAL_SERVER_ERROR, msg );
}

export function send503ServiceUnavailable (
    res: Response,
    msg: ResponseMessage = 'SERVICE_UNAVAILABLE'
) {
    sendJSONresponse( res, HTTP.SERVICE_UNAVAILABLE, msg );
}


export const callbackError400 = (
    req: Request,
    res: Response
) => send400BadRequest( res, 'callbackE400' );

export const callbackError405 = (
    req: Request,
    res: Response
) => send405MethodNotAllowed( res, 'callbackE405' );
