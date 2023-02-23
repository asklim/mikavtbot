// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )('lib:raw:node-fetch');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Readable'.
const { Readable } = require( 'stream' );
const { 
    //createWriteStream,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createRead... Remove this comment to see the full error message
    createReadStream 
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('fs');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const nodeFetch = require( 'node-fetch' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FormData'.
const FormData = require( 'form-data' );


//lass ZeroSizeError extends Error {}
// @ts-expect-error TS(2300): Duplicate identifier 'NetworkError'.
class NetworkError extends Error {}



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
    // Telegram требует POST with multipart/form-data
 
    
    let apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    debug( `uploadPhoto: try from '${apiSendPhotoUrl}'` );

    const form = new FormData();
    form.append( 'chat_id', chat_id );   

    let fname = `./server/images/test-informer.png`;
    let fromfile = await createReadStream( fname );

    form.append( 'photo', fromfile );

    return postingPhoto( apiSendPhotoUrl, {
        method: 'POST',
        body: form,  
    });

}




// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getStreamI... Remove this comment to see the full error message
function getStreamImageFrom( url: any ) {

        
    let getOptions = {
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
    .then( async (response: any) => {
    
        //debug( `typeof .body : ${typeof response.body }`); //object
        //debug( `response : \n${JSON.stringify( response )}`);
        //debug( `image downloaded from '${response.url}'` );
              
        //debug( 'headers : \n', response.headers.raw());
        
        if( response.status !== 200 ) {

            debug( `image download status = ${response.status}\n`,
                `W: streamImage: no image data.` );  
        }
        else {            

            // .body is PassThrough Object
            let transform = response.body;
            let buffer = await transform.read();

            let stream = new Readable();
            stream.push( buffer );
            stream.push( null );
                        
            return stream;
        }
    })
    .then( response2console )
    .catch( (error: any) => {
        debug( `catch: ERROR in 'getStreamImageFrom'\n`, error  );        
    });
}



async function uploadPhoto( {
    token,
    apiRoot,
    chat_id
}: any, url: any ) {


    // Telegram требует POST with multipart/form-data
 
    
    let apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    debug( `uploadPhoto: try from '${apiSendPhotoUrl}'` );

    const form = new FormData();
    form.append( 'chat_id', chat_id );   

    let readable = await getStreamImageFrom( url );
    // readable is stream Object of type <PassThrough>

    //debug( 'stream is ', typeof readable, ', contents ', readable );
    //debug( `stringify : \n${JSON.stringify( readable )}`);
    //let isoDate = (new Date).toISOString().split( 'T' )[0]; 
    //let fname = `./server/images/${isoDate}-nfetch.png`;
    //let dest = createWriteStream( fname );
    //readable.pipe( dest );

    //let readable = await createReadStream( fname );


    form.append( 'photo', readable );
    
    let postOptions = {
        method: 'POST',
        body: form,
        // @ts-expect-error TS(2339): Property 'getHeaders' does not exist on type 'Form... Remove this comment to see the full error message
        headers: form.getHeaders()   
    };

    //debug( `POST headers '${JSON.stringify( postOptions.headers )}'` );

    return postingPhoto( apiSendPhotoUrl, postOptions );

}




// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    //getStreamImageFrom,
    uploadPhoto,
    uploadTestPhoto,
};




function postingPhoto( urlTo: any, options: any) {

 
    return nodeFetch( urlTo, options )
    
    .then( checkStatus )
    .then( (response: any) => response.json())
    .then( response2console )
    // response.json ЗАМЕНЯЕТ следующие 2 строки
    //.then( response => response.body.read() ) //<Buffer>   
    //.then( telegramResponse => JSON.parse( telegramResponse ))
    .then( (telegramResponse: any) => {
        
        if( telegramResponse.ok ) {
        
            // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
            let dt = Date( telegramResponse.result.date );
            let isoDate = new Date( dt );            
            // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Date'.
            isoDate = isoDate.toISOString();

            let { file_id } = telegramResponse.result.photo[0];

            console.log( `SUCCESS: image uploaded at ${isoDate}, ${dt}`);
            console.log( `file_id: ${file_id}` );
        } 
        else {

            debug( `uploading error, body:\n`, telegramResponse );        
        }
    })
    .catch( (error: any) => {
        
        if( error instanceof NetworkError ) {

            console.log( `Network Error: ${error.message}` );
        }
        else {
            debug( `catch: ERROR in 'uploadPhoto'\n`, error );
        }
    });
}




function response2console( response: any )
{

    console.log('middleware-response:');
    console.log( response );
    return response;
}



function checkStatus(response: any) 
{
    //debug('check Status running ...');

    if( response.status > 199 && response.status < 300 )
    {           
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

