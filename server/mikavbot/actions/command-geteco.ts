//import { Context } from 'telegraf';

import { uploadPhoto } from '../../helpers/upload-photo';
import {
    Logger,
    //debugFactory
} from '<srv>/helpers/';

const log = new Logger('mikaV:cmd</geteco>');
//const debug = debugFactory('actions:cmd:geteco');


export default async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any
) => {
    try {
        log.info(`starting command processing to ${ctx.chat.id}...`);

        const imageURL = "http://www.ecopress.by/cgi/vitebsk.php";
        //let imageURL = "https://octodex.github.com/images/Fintechtocat.png";

        const { token } = ctx.telegram;
        //debug( '/geteco', token );
        const apiRoot = ctx.tg?.options?.apiRoot;
        const { id: chat_id } = ctx.chat;
        const file_id = await uploadPhoto(
            { token, apiRoot, chat_id },
            imageURL
        );
        log.info( file_id ? `uploaded as ${file_id}`
            : `file not uploaded` );
    }
    catch (error) {
        log.error('catch-handler:cmd:geteco\n', error );
    }
};
