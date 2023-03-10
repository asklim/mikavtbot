import path from 'node:path';
import { AxiosHeaders } from 'axios';
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
    securifyToken
} from '<srv>/helpers/';

import { TELEGRAM_API_ROOT } from '<srv>/mikavbot/telegram-endpoints';

import {
    //NetworkError,
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

type UploadOptions = {
    token: string;
    apiRoot?: string;
    chat_id: number;
};


/**
 *  Загружает тестовое фото
 *  в Telegram chat by [chat_id]
 *  @param {string} token   - токен для доступа к Telegram-боту
 *  @param {number} chat_id - id чата/пользователя куда загрузить фото
 *  @return undefined | string (file_id) - если отправка прошла успешно.
*/
function uploadTestPhoto (
    {
        token,
        chat_id
    }: UploadOptions
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
    {   token,
        apiRoot,
        chat_id
    }: UploadOptions,
    photoURL: string
) {
    try {
        const options = { token, apiRoot, chat_id };
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
    {
        token,
        apiRoot,
        chat_id
    }: UploadOptions,
    stream: ReadStream
) {
    // Telegram требует POST with form-data(multipart)

    const shortToken = securifyToken( token );
    log.info(`try upload to '${apiRoot}/bot${shortToken}/sendPhoto'`);

    const apiSendPhotoUrl = `${apiRoot}/bot${token}/sendPhoto`;

    //console.log('image stream ', stream);
    //IncomingMessage || ReadStream

    const form = new FormData();
    form.append('chat_id', chat_id );
    form.append('photo', stream );

    const postOptions = {
        url: apiSendPhotoUrl,
        data: form,
        headers: <AxiosHeaders> form.getHeaders(),
    };

    //debug( `POST headers '${JSON.stringify( postOptions.headers )}'` );

    return postImageTo( postOptions );
}
