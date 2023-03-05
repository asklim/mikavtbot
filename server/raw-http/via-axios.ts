import { default as debugFactory } from 'debug';
const debug = debugFactory('raw:via-axios');

import { consoleLogger } from '../helpers/';
const log = consoleLogger( 'raw:axios' );

import { default as axios, AxiosResponse } from 'axios';

class NetworkError extends Error {}


export {
    NetworkError,
    getStreamImageFrom,
    postImageTo,
};


/***
 *  @param  {string} url - полный адрес для скачивания изображения
 *  @return {IncomingMessage} -  readable Stream,
 *  see 'data-samples/IncomingMessage.log'
*/
async function getStreamImageFrom (
    url: string
) {
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


function postImageTo ({
    url,
    data,
    headers
}: any
) {
    return axios({
        method: 'POST',
        url, data, headers
    })
    .then( _checkStatus )
    .then( (res: AxiosResponse) => res.data )
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


/************ */


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

