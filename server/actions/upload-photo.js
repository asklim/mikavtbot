const debug = require( 'debug' )( 'actions:upload-photo' );
const path = require( 'path' );
const { consoleLogger } = require( '../helpers' );
const log = consoleLogger( 'Photo:' );

const FormData = require( 'form-data' );

const { 
    //createWriteStream,
    createReadStream 
} = require( 'fs' );

const {
    //NetworkError,
    getStreamImageFrom,
    postImageTo, 
} = require( '../raw-http/via-axios' );


/** 
 *  Загружает тестовое фото (формат .png?)
 *  в Telegram chat by [chat_id]
 *  ----
 *  from /server/image/test-informer.png
 *  @param {string} token   - токен для доступа к Telegram-боту
 *  @param {string} apiRoot - путь к Telegram API
 *  @param {number} chat_id - id чата/пользователя куда загрузить фото
 *  @return undefined | false | true
 *  ----
 *  true - если отправка прошла успешно.
*/
function uploadTestPhoto ({ token, apiRoot, chat_id }) {
    
    const options = { token, apiRoot, chat_id };
    const fname = path.resolve( `server/helpers/test-informer.png` );
    try {        
        const streamFromFile = createReadStream( fname );
        debug( 
            `read streamImage from test file ${fname},`,
            'readable Length:', streamFromFile.readableLength 
        );

        return _uploadImageStream( 
            options, 
            streamFromFile 
        );
    }
    catch (e) {
        return log.error( 
            `uploadTestPhoto: error reading from file ${fname}.` 
        );        
    }
}


/** 
 *  Скачивает фото from photoURL и Загружает 
 *  в Telegram chat by [chat_id]
 *  ---- 
 *  @param {string} token     - токен для доступа к Telegram-боту
 *  @param {string} apiRoot   - путь к Telegram API
 *  @param {number} chat_id   - id чата/пользователя куда загрузить фото
 *  @param {string} photoURL  - полный адрес для скачивания изображения
 *  @return undefined | false | true
 *  ----
 *  true - если отправка прошла успешно. 
*/
async function uploadPhoto ({ token, apiRoot, chat_id }, photoURL) {

    try {
        const options = { token, apiRoot, chat_id };
        const imageReadable = await getStreamImageFrom( photoURL );
        //console.log('image stream ', imageReadable);  //IncomingMessage

        if( !imageReadable ) { 
            throw new Error( 'no image data.' ); 
        }
        debug( 'uploadPhoto options:\n', options );

        return _uploadImageStream( 
            options, 
            imageReadable 
        );
    }
    catch (error) {
        return log.error( 
            `uploadPhoto: error image downloading.\n`, 
            error 
        );
    }
}


module.exports = {

    uploadPhoto,
    uploadTestPhoto,
};



/** 
 *  Загружает stream for photo (формат .png?)
 *  в Telegram chat by [chat_id]
 *  ----
 *  @param {string} token     - токен для доступа к Telegram-боту
 *  @param {string} apiRoot   - путь к Telegram API
 *  @param {number} chat_id   - id чата/пользователя куда загрузить фото
 *  @param {Readable} stream  - поток изображения
 *  @return undefined | false | true
 *  -----
 *  true - если отправка прошла успешно.  
*/
function _uploadImageStream ({ token, apiRoot, chat_id }, stream) {

    // Telegram требует POST with form-data(multipart)
    
    //debug( '_uploadStream: typeof token ', typeof token );
    const shortToken = token.slice(0,12) + '***' + token.substring( token.length-3 );
    log.info( `try upload to '${apiRoot}/bot${shortToken}/sendPhoto'` );

    const apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    
    //console.log('image stream ', stream);  //IncomingMessage || ReadStream

    const form = new FormData();
    form.append( 'chat_id', chat_id );
    form.append( 'photo', stream );

    let postOptions = {
        method: 'POST',
        url: apiSendPhotoUrl,
        data: form,
        headers: form.getHeaders(),
    };

    //debug( `POST headers '${JSON.stringify( postOptions.headers )}'` );

    return postImageTo( postOptions );
}
