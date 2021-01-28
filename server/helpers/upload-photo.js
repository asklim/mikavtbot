//const debug = require( 'debug' )('lib:helpers:upload-photo');

const log = require( '../helpers/logger' )('Photo:');

const FormData = require( 'form-data' );

const { 
    //createWriteStream,
    createReadStream } = require( 'fs' )
;

const {
    //NetworkError,
    getStreamImageFrom,
    postImageTo, 
} = require( '../raw-http/via-axios.js' );


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
async function uploadTestPhoto ({ token, apiRoot, chat_id }) {

    try {        
        let fromfile;
        let fname = `./server/images/test-informer.png`;
        fromfile = await createReadStream( fname );
        //debug( 'read streamImage from test file:\n', fromfile );

        return uploadImageStream( 
            { token, apiRoot, chat_id }, 
            fromfile 
        );
    }
    catch (ex) {

        log.error( `upload: read from file - no image test file.` );  
        return;
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
        let imageReadable;
        imageReadable = await getStreamImageFrom( photoURL );
        //console.log('image stream ', imageReadable);  //IncomingMessage

        return uploadImageStream( 
            { token, apiRoot, chat_id }, 
            imageReadable 
        );
    }
    catch (ex) {

        log.error( `upload: image downloading - no image data.` );  
        return;
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
function uploadImageStream ({ token, apiRoot, chat_id }, stream) {

    // Telegram требует POST with form-data(multipart)
    
    let apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    log.info( `try upload to '${apiSendPhotoUrl}'` );

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
