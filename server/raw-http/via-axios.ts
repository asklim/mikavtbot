
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'raw:via-axios' );
const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( '../helpers' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'raw:axios' );

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const axios = require( 'axios' ).default;

// @ts-expect-error TS(2300): Duplicate identifier 'NetworkError'.
class NetworkError extends Error {}


/***
 *  @param  {string} url - полный адрес для скачивания изображения
 *  @return {IncomingMessage} -  readable Stream,
 *  see 'data-samples/IncomingMessage.log'
*/
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getStreamI... Remove this comment to see the full error message
async function getStreamImageFrom (url: any) {

    try {
        const axiosResponse = await axios({
            method: 'GET',
            url,
            responseType: 'stream',
            headers: {
                "Cache-Control": 'no-cache',
            },
        });
        //*****INFO: response is Axios Response Object
        //http://zetcode.com/javascript/axios/

        //*****INFO: axiosResponse.data is IncomingMessage Object
        const readable = axiosResponse.data;

        return readable.
            // eslint-disable-next-line no-unused-vars
            on( 'error', (_err: any) => {
                log
                .error( `readable.on: ERROR image reading from '${url}'` );
            });
    }
    catch( error ) {
        log.error( `CATCH: in 'getStreamImageFrom'\n`, error );
    }
}


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'postImageT... Remove this comment to see the full error message
function postImageTo ({
    url,
    data,
    headers
}: any) {

    return axios({
        method: 'POST',
        url, data, headers
    })
    .then( _checkStatus )
    .then( (axiosResponse: any) => axiosResponse.data )
    .then( _response2console )
    .then( (telegramResponse: any) => {     // from Telegram Server

        let  fileId;
        if( telegramResponse.ok ) {

            // data.result.date = 1588088067
            const dt = telegramResponse.result.date * 1000; // to millisec
            const isoDate = (new Date( dt )).toISOString();

            //Если сразу сделать dt = new Date( ... ), то получается
            //at 1970-01-19T09:08:08.067Z, Mon Jan 19 1970 12:08:08 GMT+0300
            //(Moscow Standard Time)

            fileId = telegramResponse.result.photo[0].file_id;

            log.info( `SUCCESS: image uploaded at ${isoDate}, ${dt}` );
            log.info( `file_id:`, fileId );
        }
        else {
            debug( `uploading error, data:\n`, telegramResponse );
        }
        return fileId; //telegramResponse.ok;
    })
    .catch( (error: any) => {
        log.error( `CATCH: in 'postImageTo'\n`, error );
    });
}


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {

    NetworkError,
    getStreamImageFrom,
    postImageTo,

};


function _response2console( response: any ) {
    debug('response:\n', response );
    return response;
}


function _checkStatus( response: any ) {

    debug('check Status running ...');
    let { status, statusText } = response;

    (( status > 199 && status < 300 )
        ? debug( 'check Status is Ok.' )
        : debug( `ERROR: uploading status = ${status}, ${statusText}` )
    );
    return response;
}

