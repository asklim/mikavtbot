const debug = require( 'debug' )( 'helpers:upload-photo' );
const {
    icwd,
    consoleLogger,
    securefy,
    securetizeToken,
} = require( './' );
const log = consoleLogger( 'upload-photo:' );

const { TELEGRAM_API_ROOT } = require( '../mikavbot/telegram-endpoints.js' );

const FormData = require( 'form-data' );

const path = require( 'path' );
const { createReadStream, readdirSync } = require( 'fs' );

const {
    //NetworkError,
    getStreamImageFrom,
    postImageTo,
} = require( '../raw-http/via-axios' );

const TEST_IMAGES_DIR = `${icwd}/images/test-images`;

/**
 *  Загружает тестовое фото
 *  в Telegram chat by [chat_id]
 *  @param {string} token   - токен для доступа к Telegram-боту
 *  @param {string} apiRoot - путь к Telegram API
 *  @param {number} chat_id - id чата/пользователя куда загрузить фото
 *  @return undefined | string (file_id) - если отправка прошла успешно.
*/
function uploadTestPhoto ({ token, /*apiRoot,*/ chat_id }) {


    const options = { token, apiRoot: TELEGRAM_API_ROOT, chat_id };
    const fname = getRandomTestFileName();

    try {
        const streamFromFile = createReadStream( fname );
        debug(
            `read streamImage from test file ${fname},\n` +
            'readableHighWaterMark:', streamFromFile.readableHighWaterMark
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

function getRandomTestFileName () {

    /*const TEST_FILE_NAMES = [
        'test-greeting-hi.jpg',
        'test-informer.png'
    ];*/
    const testImagesFNames = readdirSync( TEST_IMAGES_DIR, { withFileTypes: true }).
        map( (item) => item.isFile() && item.name ).
        filter( Boolean );
    const index = Math.floor( testImagesFNames.length * Math.random());
    return path.resolve( TEST_IMAGES_DIR, testImagesFNames[ index ] );
}


/**
 *  Скачивает фото from photoURL и Загружает
 *  в Telegram chat by [chat_id]
 *  ----
 *  @param {string} token     - токен для доступа к Telegram-боту
 *  @param {string} apiRoot   - путь к Telegram API
 *  @param {number} chat_id   - id чата/пользователя куда загрузить фото
 *  @param {string} photoURL  - полный адрес для скачивания изображения
 *  @return undefined | string (file_id) - если отправка прошла успешно.
*/
async function uploadPhoto ({ token, apiRoot, chat_id }, photoURL) {

    try {
        const options = { token, apiRoot, chat_id };
        const imageReadable = await getStreamImageFrom( photoURL );
        //console.log('image stream ', imageReadable);  //IncomingMessage

        if( !imageReadable ) {
            throw new Error( 'no image data.' );
        }
        debug( 'uploadPhoto options:', securefy( options ));

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
 *  Загружает stream for photo
 *  в Telegram chat by [chat_id]
 *  ----
 *  @param {string} token     - токен для доступа к Telegram-боту
 *  @param {string} apiRoot   - путь к Telegram API
 *  @param {number} chat_id   - id чата/пользователя куда загрузить фото
 *  @param {Readable} stream  - поток изображения
 *  @return { undefined | Promise< string >} (file_id) - если отправка прошла успешно.
*/
function _uploadImageStream ({ token, apiRoot, chat_id }, stream) {

    // Telegram требует POST with form-data(multipart)

    const shortToken = securetizeToken( token );
    log.info( `try upload to '${apiRoot}/bot${shortToken}/sendPhoto'` );

    const apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;

    //console.log('image stream ', stream);  //IncomingMessage || ReadStream

    const form = new FormData();
    form.append( 'chat_id', chat_id );
    form.append( 'photo', stream );

    let postOptions = {
        url: apiSendPhotoUrl,
        data: form,
        headers: form.getHeaders(),
    };

    //debug( `POST headers '${JSON.stringify( postOptions.headers )}'` );

    return postImageTo( postOptions );
}