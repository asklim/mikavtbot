
const debug = require( 'debug' )('lib:raw:request');
const request = require( 'request' );

const { 
    //createWriteStream,
    createReadStream 
} = require('fs');

const TEST_PHOTO_FNAME = `./server/images/test-informer.png`;



/** 
 *  @param  url  - полный адрес для скачивания изображения
 *  @return Request {}
 *   see 'data-samples/Request.log'
*/
function getStreamImageFrom (url) {

    
    const getOptions = {
        url,
        encoding: null,
        headers: {
            "Cache-Control": "no-cache",
        },
    };

    return request
            .get( getOptions )
            .on( 'error', (err) => 
            { 
                debug( `error image downloading from '${url}':\n`, err  );
            })
            .on( 'response', (res) => 
            {
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



async function uploadPhoto ({ token, apiRoot, chat_id }, photoUrl) {


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


async function uploadTestPhoto ({ token, apiRoot, chat_id }) {


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


module.exports = {

    //getStreamImageFrom,
    uploadPhoto,
    uploadTestPhoto,
};



function postingPhoto (options) {


    return request.post( 
        options,
        (error, response, responseBody) => {
            
            if( error ) {

                debug( `E: error image uploading `,
                    `to '${response.request.href}'\n`, error  );
                return;   
            }        
            //debug('request POST-response:\n', response); //IncomingMessage
            //debug( `typeof 'resBody': ${typeof resBody}` ); //string
            
            let telegramRes = JSON.parse( responseBody );
            
            if( telegramRes.ok ) {

                let dt = Date( telegramRes.result.date );
                let isoDate = new Date( dt );            
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

