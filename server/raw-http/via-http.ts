import { default as debugFactory } from 'debug';
const debug = debugFactory('raw:via-http');

import http from 'node:http';

import { ApiResponse, Message } from 'typegram';
type TgPhotoMessage = ApiResponse<Message.PhotoMessage>;

export {
    getStreamImageFrom,
    postImageTo
};


/**
 *  Скачивает изображение по адресу url
 *  ------------------------------------
 *  @param  url  - полный адрес для скачивания изображения
 *  @return {Readable stream} - Incoming Message
 *   see 'data-samples/Request.log'
*/
function getStreamImageFrom (
    url: string
) {

    const getOptions = {
        encoding: null,
        headers: {
            "Cache-Control": "no-cache",
        },
    };

    return new Promise( (resolve, reject) => {

        http.
        get( url, getOptions, (res: http.IncomingMessage) => {

            const { statusCode } = res;
            let error;

            if( statusCode !== 200 ) {
                error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            }

            if( error ) {
                debug(`E: error image downloading from '${url}':\n`, error  );
                res.resume();
                reject( error );
                return;
            }

            debug(`I: image downloaded from '${url}'` );
            debug(`I: image downloaded: res.statusCode= ${statusCode}` );
            resolve( res );
        });
    });
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function postImageTo (options: any) {

    const { body, ...rest } = options;
    debug( 'http.request options:\n', rest );

    const req = http.request( rest );

    // Write data to request body
    body.pipe( req );

    req.on( 'error', (error) => {

        console.log(
            `E: error image uploading to '${req.path}'\n`,
            error
        );
    });

    req.on( 'response', async (res: http.IncomingMessage) => {

        if( res.statusCode !== 200 ) {

            console.log(
                `E: uploading error: res.statusCode = ${res.statusCode}\n`
                //+`body (tg-data): `, telegramRes
            );
            return;
        }

        //debug('http.request POST-response:\n', res); //IncomingMessage
        //debug( `typeof 'res.body': ${typeof res.body}` ); //undefined
        debug( `STATUS: ${res.statusCode}` );

        const response = await res.read();
        debug( 'http.request POST-response.read():\n', response );

        const telegramRes = <TgPhotoMessage> JSON.parse( response );

        if( telegramRes.ok ) {

            const dt = new Date( telegramRes.result?.date );
            const isoDate = dt.toISOString();

            const file_id = telegramRes.result?.photo[0]?.file_id;
            console.log( `SUCCESS: image uploaded at ${isoDate}, ${dt}`);
            console.log( `file_id: ${file_id}` );
        }
    });
}
