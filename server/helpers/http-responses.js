
const HTTP = require( `./http-response-codes` );


const sendJSONresponse = (res, status, content) => {
    res.status( status );
    res.json( content );
};


const send200Ok = (res, msg = 'OK') => 
    sendJSONresponse( res, 
        HTTP.OK, 
        { message: msg } 
    )
;

const send201Created = (res, msg = 'CREATED') => 
    sendJSONresponse( res, 
        HTTP.CREATED, 
        { message: msg } 
    )
;

const send400BadRequest = (res, msg = 'BAD_REQUEST (invalid syntax)') => 
    sendJSONresponse( res, 
        HTTP.BAD_REQUEST, 
        { message: msg } 
    )
;

const send404NotFound = (res, msg = 'NOT_FOUND') => 
    sendJSONresponse( res, 
        HTTP.NOT_FOUND, 
        { message: msg } 
    )
;

// Метод запроса не разрешен к использованию для данного URL
const send405MethodNotAllowed = (res, msg = 'METHOD_NOT_ALLOWED') =>    
    sendJSONresponse( res, 
        HTTP.METHOD_NOT_ALLOWED, 
        { message: msg } 
    )
;

const send409Conflict = (res, msg = 'CONFLICT') =>    
    sendJSONresponse( res, 
        HTTP.CONFLICT, 
        { message: msg } 
    )
;

const send500ServerError = (res, msg = 'INTERNAL_SERVER_ERROR') =>    
    sendJSONresponse( res, 
        HTTP.INTERNAL_SERVER_ERROR, 
        { message: msg } 
    )
;

const send503ServiceUnavailable = (res, msg = 'SERVICE_UNAVAILABLE') =>    
    sendJSONresponse( res, 
        HTTP.SERVICE_UNAVAILABLE, 
        { message: msg } 
    )
;


const callbackError400 = (req, res) => send400BadRequest( res );
const callbackError405 = (req, res) => send405MethodNotAllowed( res );


module.exports = {

    sendJSONresponse,

    send200Ok,
    send201Created,
    send400BadRequest,
    send404NotFound,
    send405MethodNotAllowed,
    send409Conflict,
    send500ServerError,
    send503ServiceUnavailable,

    callbackError400,
    callbackError405,
};
