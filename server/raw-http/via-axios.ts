import {
    default as axios,
    AxiosResponse,
    //AxiosHeaders
} from 'axios';

//import FormData from 'form-data';

import {
    debugFactory,
    Logger,
    TPostOptions,
    TgPhotoMessage
} from '<srv>/helpers/';

const debug = debugFactory('raw:via-axios');
const log = new Logger('raw:axios');


export {
    getStreamImageFrom,
    postImageTo,
};


/***
 *  @param  {string} url - полный адрес для скачивания изображения
 *  @return {IncomingMessage} -  readable Stream,
 *  see 'data-samples/IncomingMessage.log'
*/
async function getStreamImageFrom (
    url: string
) {
    try {
        const axiosResponse = await axios({
            method: 'GET',
            url,
            responseType: 'stream',
            headers: {
                "Cache-Control": 'no-cache',
            },
        });
        //*****INFO: response is Axios Response Object
        //http://zetcode.com/javascript/axios/

        //*****INFO: axiosResponse.data is IncomingMessage Object
        const readable = axiosResponse.data;

        return readable.
            // eslint-disable-next-line no-unused-vars
            on( 'error', (/*err*/) => {
                log.error(`readable.on: ERROR image reading from '${url}'`);
            });
    }
    catch( error ) {
        log.error( `CATCH: in 'getStreamImageFrom'\n`, error );
    }
}


async function postImageTo (
    {   url,
        formData,
    }: TPostOptions<never>
) {
    try {
        //const headers
        const res = await axios({
            method: 'POST',
            url,
            data: formData,
            headers: formData.getHeaders()
        });
        _checkStatus( res );
        const fromTelegram = <TgPhotoMessage> res?.data;
        // from Telegram Server

        debug('Telegram response:\n', fromTelegram );

        let  fileId: string | undefined;

        if( fromTelegram.ok ) {

            // debug( fromTelegram.result?.photo );
            // data.result.date = 1588088067
            const dt = fromTelegram.result.date * 1000; // to millisec
            const isoDate = (new Date( dt )).toISOString();

            //Если сразу сделать dt = new Date( ... ), то получается
            //at 1970-01-19T09:08:08.067Z, Mon Jan 19 1970 12:08:08 GMT+0300
            //(Moscow Standard Time)

            fileId = fromTelegram.result.photo[0]?.file_id;

            log.info(`SUCCESS: image uploaded at ${isoDate}, ${dt}` );
            log.info(`file_id:`, fileId );
        }
        else {
            debug(`uploading error, data:\n`, fromTelegram );
        }
        return fileId;
    }
    catch (err) {
        log.error(`CATCH: in 'postImageTo'\n`, err );
    }
}


async function _checkStatus(
    response: AxiosResponse
) {
    const { status, statusText } = response;

    (( status > 199 && status < 300 ) ?
        debug('check Status is Ok (within 200..299).')
        : debug(`ERROR: uploading status = ${status}, ${statusText}`)
    );
}
