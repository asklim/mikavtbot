import { default as debugFactory } from 'debug';
const debug = debugFactory('raw:via-node-fetch');

import { Readable } from 'node:stream';
import nodeFetch, { Response } from 'node-fetch';

// class ZeroSizeError extends Error {}
class NetworkError extends Error {}


export {
    NetworkError,
    getStreamImageFrom,
    postImageTo,
};



function getStreamImageFrom (
    url: string
) {
    const getOptions = {
        method: 'GET',
        //url,
        //encoding: null,
        headers: {
            "Cache-Control": 'no-cache',
        },
    };
    //debug( `streamImage: try get image-stream from ${url}`);

    return nodeFetch( url, getOptions )

    //.then( response2console )
    .then( async (response: Response) => {

        //debug( `typeof .body : ${typeof response.body }`); //object
        //debug( `response : \n${JSON.stringify( response )}`);
        //debug( `image downloaded from '${response.url}'` );

        //debug( 'headers : \n', response.headers.raw());

        if( response.status !== 200 ) {
            debug(
                `image download status = ${response.status}\n`,
                `W: streamImage: no image data.` );
        }
        else {
            // .body is PassThrough Object
            const transform = response.body;
            const buffer = await transform.read();

            const stream = new Readable();
            stream.push( buffer );
            stream.push( null );

            return stream;
        }
    })
    .then( response2console )
    .catch( (error) => {
        debug( `catch: ERROR in 'getStreamImageFrom'\n`, error  );
    });
}



function postImageTo (
    urlTo: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any
) {
    return nodeFetch( urlTo, options )

    .then( checkStatus )
    .then( (response: Response) => response.json())
    .then( response2console )
    // response.json ЗАМЕНЯЕТ следующие 2 строки
    //.then( response => response.body.read() ) //<Buffer>
    //.then( telegramResponse => JSON.parse( telegramResponse ))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then( (tgRes: any) => {

        if( tgRes.ok ) {

            const dt = new Date( tgRes.result?.date );
            const isoDate = dt.toISOString();

            const file_id = tgRes.result?.photo[0]?.file_id;

            console.log(`SUCCESS: image uploaded at ${isoDate}, ${dt}`);
            console.log(`file_id: ${file_id}`);
        }
        else {

            debug(`uploading error, body:\n`, tgRes );
        }
    })
    .catch( (error) => {

        if( error instanceof NetworkError ) {
            console.log(`Network Error: ${error.message}`);
        }
        else {
            debug(`catch: ERROR in 'uploadPhoto'\n`, error );
        }
    });
}




function response2console (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: any
) {
    console.log('node-fetch, middleware-response:');
    console.log( response );
    return response;
}



function checkStatus (
    response: Response
) {
    //debug('check Status running ...');

    if( response.status > 199 && response.status < 300 ) {
        //debug( response );
        //debug( 'headers : \n', response.headers.raw());

        debug('check Status is Ok.');
        return response;
    }
    else {
        //debug( `uploading error.status = ${response.status}\n`,
        //       `response: `, response);
        throw new NetworkError( response.statusText );
    }
}
