import path from 'node:path';
import {
    createReadStream,
    Dirent,
    ReadStream,
    readdirSync
} from 'node:fs';

import FormData from 'form-data';

import {
    icwd,
    debugFactory,
    Logger,
    securifyObjByList,
    securifyToken,
    TgUploadOptions
} from '<srv>/helpers/';

import { TELEGRAM_API_ROOT } from '<srv>/mikavbot/telegram-endpoints';

import {
    getStreamImageFrom,
    postImageTo,
} from '<srv>/raw-http/via-axios';

const TEST_IMAGES_DIR = `${icwd}/images/test-images`;

const log = new Logger('upload-photo:');
const debug = debugFactory('helpers:upload-photo');


export {
    uploadPhoto,
    uploadTestPhoto,
};


/**
 *  Загружает тестовое фото
 *  в Telegram chat by [chat_id]
 *  @param {string} token   - токен для доступа к Telegram-боту
 *  @param {number} chat_id - id чата/пользователя куда загрузить фото
 *  @return undefined | string (file_id) - если отправка прошла успешно.
*/
async function uploadTestPhoto (
    {   token,
        chat_id
    }: TgUploadOptions
) {
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
        log.error(`uploadTestPhoto: error reading from file ${fname}.`);
        return;
    }
}


function getRandomTestFileName () {

    const testImagesFNames = readdirSync( TEST_IMAGES_DIR, { withFileTypes: true }).
        map( (item: Dirent) => item.isFile() && item.name ).
        filter( Boolean );
    const index = Math.floor( testImagesFNames.length * Math.random());
    return path.resolve( TEST_IMAGES_DIR, <string>testImagesFNames[ index ] );
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
async function uploadPhoto (
    options: TgUploadOptions,
    photoURL: string
) {
    try {
        //const options = { token, apiRoot, chat_id };
        const imageReadable = await getStreamImageFrom( photoURL );
        //console.log('image stream ', imageReadable);  //IncomingMessage

        if( !imageReadable ) {
            throw new Error('no image data.');
        }
        debug('uploadPhoto options:', securifyObjByList( options ));

        return _uploadImageStream(
            options,
            imageReadable
        );
    }
    catch (error) {
        log.error(
            `uploadPhoto: error image downloading.\n`,
            error
        );
    }
}


/**
 *  Загружает stream for photo
 *  в Telegram chat by [chat_id]
 *  ----
 *  @param {string} options.token     - токен для доступа к Telegram-боту
 *  @param {string} options.apiRoot   - путь к Telegram API
 *  @param {number} options.chat_id   - id чата/пользователя куда загрузить фото
 *  @param {Readable} stream  - поток изображения
 *  @return { undefined | Promise< string >} (file_id) - если отправка прошла успешно.
*/
function _uploadImageStream (
    {   token,
        apiRoot,
        chat_id
    }: TgUploadOptions,
    stream: ReadStream
) {
    // Telegram требует POST with form-data(multipart)

    const shortToken = securifyToken( token );
    log.info(`try upload to '${apiRoot}/bot${shortToken}/sendPhoto'`);

    const apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;

    //console.log('image stream ', stream);
    //IncomingMessage || ReadStream

    const formData = new FormData();
    formData.append('chat_id', chat_id );
    formData.append('photo', stream );

    return postImageTo({
        url: apiSendPhotoUrl,
        formData,
    });
}
