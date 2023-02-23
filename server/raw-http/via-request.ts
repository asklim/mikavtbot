
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )('lib:raw:request');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const request = require( 'request' );

const { 
    //createWriteStream,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createRead... Remove this comment to see the full error message
    createReadStream 
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('fs');

const TEST_PHOTO_FNAME = `./server/images/test-informer.png`;



/** 
 *  @param  url  - полный адрес для скачивания изображения
 *  @return Request {}
 *   see 'data-samples/Request.log'
*/
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getStreamI... Remove this comment to see the full error message
function getStreamImageFrom (url: any) {

    
    const getOptions = {
        url,
        encoding: null,
        headers: {
            "Cache-Control": "no-cache",
        },
    };

    return request
            .get( getOptions )
            .on( 'error', (err: any) => { 
                debug( `error image downloading from '${url}':\n`, err  );
            })
            .on( 'response', (res: any) => {
                //debug( 'request GET-response:\n', res );
                // Incoming Message
                debug( `image downloaded from '${res.request.href}'` );
                debug( `image downloaded: res.statusCode= ${res.statusCode}` );
        
                if( res.statusCode !== 200 ) 
                {
                    debug( `image downloading: no image data.` );  
                }
            });
    //debug( 
    //    `image downloading: Length= ${buffer.length}. ` +
    //    `Is buffer= ${(buffer instanceof Buffer)}` );
    //debug( `image downloading: buffer=\n`, buffer ); 
    //<Buffer 89 50 4e 47 0d 0a 1a 0a 00  ... 6014 more bytes>
}



async function uploadPhoto ({
    token,
    apiRoot,
    chat_id
}: any, photoUrl: any) {


    const readable = await getStreamImageFrom( photoUrl );
    // debug( 'request streamImage GET-response:\n', readable );
    // Request Object
    
    const postOptions = {
        url: `${apiRoot}/bot${token}/sendPhoto`,
        headers: {
            "Content-Type": 'multipart/form-data',
        },
        formData: { 
            chat_id,
            photo: readable,
        }    
    };

    debug( `upload image: POST to '${postOptions.url}'` );
    //debug( `upload image: post Options :\n${JSON.stringify( postOptions )}` );

    return postingPhoto( postOptions );
}


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uploadTest... Remove this comment to see the full error message
async function uploadTestPhoto ({
    token,
    apiRoot,
    chat_id
}: any) {


    const fromfile = await createReadStream( TEST_PHOTO_FNAME );
    // debug( 'request streamImage GET-response:\n', fromfile );
    // Request Object
    
    const postOptions = {
        url: `${apiRoot}/bot${token}/sendPhoto`,
        headers: {
            "Content-Type": 'multipart/form-data',
        },
        formData: { 
            chat_id,
            photo: fromfile,
        }    
    };

    //debug( `upload image: POST to '${postOptions.url}'` );
    //debug( `upload image: post Options :\n${JSON.stringify( postOptions )}` );

    return postingPhoto( postOptions );
}


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {

    //getStreamImageFrom,
    uploadPhoto,
    uploadTestPhoto,
};



function postingPhoto (options: any) {


    return request.post( 
        options,
        (error: any, response: any, responseBody: any) => {
            
            if( error ) {

                debug( `E: error image uploading `,
                    `to '${response.request.href}'\n`, error  );
                return;   
            }        
            //debug('request POST-response:\n', response); //IncomingMessage
            //debug( `typeof 'resBody': ${typeof resBody}` ); //string
            
            let telegramRes = JSON.parse( responseBody );
            
            if( telegramRes.ok ) {

                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                let dt = Date( telegramRes.result.date );
                let isoDate = new Date( dt );            
                // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Date'.
                isoDate = isoDate.toISOString();

                let { file_id } = telegramRes.result.photo[0];
                console.log( `SUCCESS: image uploaded at ${isoDate}, ${dt}`);
                console.log( `file_id: ${file_id}` );

            } 
            else {
                console.log( 
                    `E: uploading error: ` +
                    `res.statusCode = ${response.statusCode}\n` +
                    `body (tg-data): `, telegramRes 
                );
            }      
        }
    );
}

