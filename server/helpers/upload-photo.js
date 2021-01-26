//const debug = require( 'debug' )('lib:helpers:upload-photo');

const FormData = require( 'form-data' );

const { 
    //createWriteStream,
    createReadStream } = require( 'fs' )
;

const {
    //NetworkError,
    getStreamImageFrom,
    postImageTo, } = require( '../raw-http/via-axios.js' )
;



/** 
 *  @param {string} token   - токен для доступа к Telegram-боту
 *  @param {string} apiRoot - путь к Telegram API
 *  @param {number} chat_id - id чата/пользователя куда загрузить фото
 *  @return {Promise}
 *  Загружает тестовое фото,
 *  'test photo' is /server/image/test-informer.png
*/
async function uploadTestPhoto ({ token, apiRoot, chat_id }) {

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

    return uploadImageStream( { token, apiRoot, chat_id }, fromfile );

}


/** 
 *  @param {string} token     - токен для доступа к Telegram-боту
 *  @param {string} apiRoot   - путь к Telegram API
 *  @param {number} chat_id   - id чата/пользователя куда загрузить фото
 *  @param {string} photoURL  - полный адрес для скачивания изображения
 *  @return {Promise}
*/
async function uploadPhoto ({ token, apiRoot, chat_id }, photoURL) {

    let imageReadable;

    try {

        imageReadable = await getStreamImageFrom( photoURL );
        //console.log('image stream ', imageReadable);  //IncomingMessage
    }
    catch (ex) {

        console.log( `E: image downloading: no image data.` );  
        return;
    }

    return uploadImageStream( { token, apiRoot, chat_id }, imageReadable );

}



module.exports = {

    uploadPhoto,
    uploadTestPhoto,

};



/** 
 *  @param {string} token     - токен для доступа к Telegram-боту
 *  @param {string} apiRoot   - путь к Telegram API
 *  @param {number} chat_id   - id чата/пользователя куда загрузить фото
 *  @param {Readable} stream  - поток изображения
 *  @return {}
*/
function uploadImageStream ({ token, apiRoot, chat_id }, stream) {

    // Telegram требует POST with form-data(multipart)
    
    let apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;
    console.log( `uploadPhoto: try to '${apiSendPhotoUrl}'` );

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
