
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const HTTP = require( `./http-response-codes` );


/**
 * Send content as 'object' ONLY.
 * @param {*} res
 * @param {*} status
 * @param {*} content
 */
function sendJSONresponse (res: any, status: any, content = 'response') {

    let response = ( typeof content === 'object' ) ? content : { 'message': content };
    res.status( status ).json( response );
}


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'send200Ok'... Remove this comment to see the full error message
function send200Ok (res: any, msg = 'OK') {
    sendJSONresponse( res, HTTP.OK, msg );
}

function send201Created (res: any, msg = 'CREATED') {
    sendJSONresponse( res, HTTP.CREATED, msg );
}

function send204NoContent (res: any, msg = 'NO_CONTENT') {
    sendJSONresponse( res, HTTP.NO_CONTENT, msg );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'send400Bad... Remove this comment to see the full error message
function send400BadRequest (res: any, msg = 'BAD_REQUEST (invalid syntax)') {
    sendJSONresponse( res, HTTP.BAD_REQUEST, msg );
}

function send401UnAuthorized (res: any, msg = 'UnAuthorized') {
    sendJSONresponse( res, HTTP.UNAUTHORIZED, msg );
}

function send404NotFound (res: any, msg = 'NOT_FOUND') {
    sendJSONresponse( res, HTTP.NOT_FOUND, msg );
}

// Метод запроса не разрешен к использованию для данного URL
function send405MethodNotAllowed (res: any, msg = 'METHOD_NOT_ALLOWED') {
    sendJSONresponse( res, HTTP.METHOD_NOT_ALLOWED, msg );
}

function send409Conflict (res: any, msg = 'CONFLICT') {
    sendJSONresponse( res, HTTP.CONFLICT, msg );
}

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'send500Ser... Remove this comment to see the full error message
function send500ServerError (res: any, msg = 'INTERNAL_SERVER_ERROR') {
    sendJSONresponse( res, HTTP.INTERNAL_SERVER_ERROR, msg );
}

function send503ServiceUnavailable (res: any, msg = 'SERVICE_UNAVAILABLE') {
    sendJSONresponse( res, HTTP.SERVICE_UNAVAILABLE, msg );
}


const callbackError400 = (req: any, res: any) => send400BadRequest( res, 'callbackE400' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'callbackEr... Remove this comment to see the full error message
const callbackError405 = (req: any, res: any) => send405MethodNotAllowed( res, 'callbackE405' );


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {

    sendJSONresponse,

    send200Ok,
    send201Created,
    send204NoContent,

    send400BadRequest,
    send401UnAuthorized,
    send404NotFound,
    send405MethodNotAllowed,
    send409Conflict,

    send500ServerError,
    send503ServiceUnavailable,

    callbackError400,
    callbackError405,
};
