// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )('lib:raw:via-bent');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const bent = require( 'bent' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FormData'.
const FormData = require('form-data');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Readable'.
const { Readable } = require( 'stream' );

const { 
    //createWriteStream,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createRead... Remove this comment to see the full error message
    createReadStream 
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('fs');

const { 
    //icwd, 
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger 
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( './helpers' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'lib-via-bent:' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uploadTest... Remove this comment to see the full error message
async function uploadTestPhoto( {
    token,
    apiRoot,
    chat_id
}: any ) {


    /** 
     *  @param  token     - токен для доступа к Telegram-боту
     *  @param  apiRoot   - путь к Telegram API
     *  @param  chat_id   - id чата/пользователя куда загрузить фото
     *  @return 
     *   see 'data-samples/Request.log'
     *   'test photo' is /server/image/test-informer.png
     */
    // Telegram требует POST with form-data(multipart)

    
    let apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    console.log( `uploadPhoto: try to '${apiSendPhotoUrl}'` );    

    const form = new FormData();
    form.append( 'chat_id', chat_id );
        
    let fname = `./server/images/test-informer.png`;
    let fromfile = await createReadStream( fname );
    console.log( 'fromfile stream ', fromfile );

    form.append( 'photo', fromfile );

    let postOptions = {
        method: 'POST',
        url: apiSendPhotoUrl,
        body: form,
        // @ts-expect-error TS(2339): Property 'getHeaders' does not exist on type 'Form... Remove this comment to see the full error message
        headers: form.getHeaders(),
    };

    //debug( `POST headers '${JSON.stringify( postOptions.headers )}'` );

    return postingPhoto( postOptions );
    
}



// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getStreamI... Remove this comment to see the full error message
async function getStreamImageFrom( url: any ) {


    /***  
     *  @param  {String} url  - полный адрес для скачивания изображения
     *  @return {PassThrough} 
     *  see 'data-samples/.log'
     */

    let headers = {
        "Cache-Control": 'no-cache',        
    };

    try {
        
        //const getStream = bent( url );
        //let bentPassThrough = await getStream( '', null, headers);
        
        //debug( `status ${bentPassThrough.status}, ${bentPassThrough.statusMessage}`); 
        //console.log( bentPassThrough );
        
        //*****INFO: response is PassThrough Object 
        //*****INFO: response._response is IncomingMessage Object

        //let buffer = await bentPassThrough.read();
        let getBuffer = bent( 'buffer' );
        let buffer = await getBuffer( url, null, headers );
        
        let stream = new Readable();
        stream.push( buffer );
        stream.push( null );

        return stream;
        /*new Readable({ 

            async read(size) {
                
                debug( 'buffer from readable: ', buffer );
                this.push( buffer );
                this.push( null );
                //debug( 'this: ', this ); //<- Readable
            }
        })*/
    } 
    catch (error) {
        
        debug( `catch: ERROR in 'getStreamImageFrom'\n`, error );
    }
}



async function uploadPhoto( {
    token,
    apiRoot,
    chat_id
}: any, photoURL: any ) {


    /** 
     *  @param  token     - токен для доступа к Telegram-боту
     *  @param  apiRoot   - путь к Telegram API
     *  @param  chat_id   - id чата/пользователя куда загрузить фото
     *  @param  photoURL  - полный адрес для скачивания изображения
     *  @return  {}
     *   
     */
    // Telegram требует POST with form-data(multipart)

    
    let apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    console.log( `uploadPhoto: try to '${apiSendPhotoUrl}'` );

    const imageStream = await getStreamImageFrom( photoURL );
    
    console.log( 'image stream ', imageStream ); 

    //let buffer = await imageStream.read();
    //debug( 'buffer from uploadPhoto: ', buffer ); //<Buffer ...>
    //let buffer2 = await imageStream.read();
    //debug( 'buffer2 from uploadPhoto: ', buffer2 ); // null
        
    /*let isoDate = (new Date).toISOString().split( 'T' )[0]; 
        let fname = `./server/images/${isoDate}-bent.png`;
        let dest = createWriteStream( fname );
        imageStream.pipe( dest );*/


    const form = new FormData();
    form.append( 'chat_id', chat_id );
    form.append( 'photo', imageStream );

    let postOptions = {
        method: 'POST',
        url: apiSendPhotoUrl,
        body: form,
        // @ts-expect-error TS(2339): Property 'getHeaders' does not exist on type 'Form... Remove this comment to see the full error message
        headers: form.getHeaders(),
    };

    //debug( `POST headers '${JSON.stringify( postOptions.headers )}'` );

    return postingPhoto(  postOptions );

}



// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {

    //getStreamImageFrom,
    uploadPhoto,
    uploadTestPhoto,
};




async function postingPhoto( options: any ) {

    
    let {
        url, body, headers 
    } = options;

    const bentPost = bent('POST');

    try {

        //<PassThrough {}>
        let response = await bentPost( url, body, headers );
        
        //debug(`bent-response after 'POST' to TeleGram:`)
        //console.log( response );
        let { status, statusMessage } = response;

        if( status > 199 && status < 300 ) {
            
            let telegramRes = await response.json();  // from Telegram Server
        
            if( telegramRes.ok ) {
                
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                let dt = Date( telegramRes.result.date );
                let isoDate = new Date( dt );            
                // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Date'.
                isoDate = isoDate.toISOString();
                //Если сразу сделать dt = new Date( ... ), то получается 
                //at 1970-01-19T09:08:08.067Z, Mon Jan 19 1970 12:08:08 GMT+0300 
                //(Moscow Standard Time)
                // data.result.date = 1588088067

                let { file_id } = telegramRes.result.photo[0];
                log.info( 
                    `SUCCESS: image uploaded at ${isoDate}, ${dt}`,
                    `\nfile_id: ${file_id}` 
                );
            } 
            else {
                debug( `uploading error, data:\n`, telegramRes );        
            }
            return telegramRes.ok;
        }
        else {            
            log.error( `postingPhoto: status ${status} ${statusMessage}` );
        }           
    }
    catch (error) {
        debug( `CATCH: ERROR in 'postingPhoto'\n`, error );                  
    }

}


/*function response2console( response ) {

    console.log('response:\n', response );
    return response;
}*/

