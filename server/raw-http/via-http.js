const debug = require( 'debug' )('lib:helpers:HTTP');
const http = require( 'http' );

const { 
    //createWriteStream,
    createReadStream } = require( 'fs' )
;

const FormData = require( 'form-data' );


/** 
 *  Скачивает изображение по адресу url
 *  ------------------------------------
 *  @param  url  - полный адрес для скачивания изображения
 *  @return {Readable stream} - Incoming Message
 *   see 'data-samples/Request.log'
*/
function getStreamImageFrom (url) {

    let getOptions = {
        encoding: null,
        headers: {
            "Cache-Control": "no-cache",
        },
    };

    return new Promise( (resolve, reject) => {

        http
        .get( url, getOptions, res => {

            const { statusCode } = res;
            let error;

            if( statusCode !== 200 ) {

                error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            }

            if( error ) {

                debug( `E: error image downloading from '${url}':\n`, error  );
                res.resume();
                reject( error );
                return;
            }

            // res {: Incoming Message}
            debug( `I: image downloaded from '${res.request.href}'` );
            debug( `I: image downloaded: res.statusCode= ${statusCode}` );
            resolve( res );            
        });
    });
}


/** 
 *  @param {string} token     - токен для доступа к Telegram-боту
 *  @param {string} apiRoot   - путь к Telegram API
 *  @param {} chat_id   - id чата/пользователя куда загрузить фото
 *  @param {string} photoUrl - откуда брать фото
 *  @return 
 **/
async function uploadPhoto ({ token, apiRoot, chat_id }, photoUrl) {



    let readable;

    try {
        readable = await getStreamImageFrom( photoUrl );
        //debug( 'http streamImage GET-response:\n', readable );    
    }
    catch (ex) {

        console.log( `E: image downloading: no image data.` );  
        return;
    }
    
    let apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    debug( `uploadPhoto: try from '${apiSendPhotoUrl}'` );

    const form = new FormData();
    form.append( 'chat_id', chat_id );
    form.append( 'photo', readable );

    const url = new URL( apiSendPhotoUrl );
    
    const postOptions = {
        ... url,
        method: 'POST',
        headers: form.getHeaders(),
        body: form,
    };

    debug( `upload image: POST to '${postOptions.url}'` );
    //debug( `upload image: post Options :\n${JSON.stringify( postOptions )}` );

    return postingPhoto( postOptions );

}



/** 
 *  @param  token     - токен для доступа к Telegram-боту
 *  @param  apiRoot   - путь к Telegram API
 *  @param  chat_id   - id чата/пользователя куда загрузить фото
 *  @return 
 *   see 'data-samples/Request.log'
 *   'test photo' is /server/image/test-informer.png
 */
async function uploadTestPhoto ({ token, apiRoot, chat_id }) {

    // Telegram требует POST with multipart/form-data

    let fromfile;

    try {
        let fname = `./server/images/test-informer.png`;
        fromfile = await createReadStream( fname );
        //debug( 'read streamImage from test file:\n', fromfile );
    }
    catch (ex) {

        console.log( `E: read from file: no image test file.` );  
        return;
    }

    let apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    debug( `uploadPhoto: try from '${apiSendPhotoUrl}'` );

    const form = new FormData();
    form.append( 'chat_id', chat_id );
    form.append( 'photo', fromfile );

    const url = new URL( apiSendPhotoUrl );
    
    const postOptions = {
        ... url,
        method: 'POST',
        headers: form.getHeaders(),
        body: form,
    };

    return postingPhoto( postOptions );
}


module.exports = 
{
    //getStreamImageFrom,
    uploadPhoto,
    uploadTestPhoto,

};



function postingPhoto (options) {

    const { body, ...rest } = options;
    debug( 'http.request options:\n', rest );

    const req = http.request( rest );
    
    // Write data to request body
    body.pipe( req );    

    req.on( 'error', error => {
    
        console.log( 
            `E: error image uploading to '${req.href}'\n`,
            error 
        );    
    });
      
    req.on( 'response', async (res) => {
        
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

        let response = await res.read();
        debug( 'http.request POST-response.read():\n', response );

        let telegramRes = JSON.parse( response );
        
        if( telegramRes.ok ) {

            let dt = Date( telegramRes.result.date );
            let isoDate = new Date( dt );            
            isoDate = isoDate.toISOString();

            let { file_id } = telegramRes.result.photo[0];
            console.log( `SUCCESS: image uploaded at ${isoDate}, ${dt}`);
            console.log( `file_id: ${file_id}` );
        }        
    });
}
