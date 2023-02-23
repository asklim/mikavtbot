// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'helpers:upload-photo' );
const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'icwd'.
    icwd,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securefy'.
    securefy,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securetize... Remove this comment to see the full error message
    securetizeToken,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( './' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'upload-photo:' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TELEGRAM_A... Remove this comment to see the full error message
const { TELEGRAM_API_ROOT } = require( '../mikavbot/telegram-endpoints.js' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FormData'.
const FormData = require( 'form-data' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require( 'path' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createRead... Remove this comment to see the full error message
const { createReadStream, readdirSync } = require( 'fs' );

const {
    //NetworkError,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getStreamI... Remove this comment to see the full error message
    getStreamImageFrom,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'postImageT... Remove this comment to see the full error message
    postImageTo,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
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
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uploadTest... Remove this comment to see the full error message
function uploadTestPhoto ({
    token,
    /*apiRoot,*/ chat_id
}: any) {


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
        map( (item: any) => item.isFile() && item.name ).
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
// @ts-expect-error TS(2393): Duplicate function implementation.
async function uploadPhoto ({
    token,
    apiRoot,
    chat_id
}: any, photoURL: any) {

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


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
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
function _uploadImageStream ({
    token,
    apiRoot,
    chat_id
}: any, stream: any) {

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
        // @ts-expect-error TS(2339): Property 'getHeaders' does not exist on type 'Form... Remove this comment to see the full error message
        headers: form.getHeaders(),
    };

    //debug( `POST headers '${JSON.stringify( postOptions.headers )}'` );

    return postImageTo( postOptions );
}
