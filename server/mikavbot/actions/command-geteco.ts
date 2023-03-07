//import { Context } from 'telegraf';

import { uploadPhoto } from '../../helpers/upload-photo';
import { Logger, debugFactory } from '<srv>/helpers/';

const log = new Logger('mikaV:');
//const debug = debugFactory('actions:cmd:geteco');


export default async (
    ctx: any
) => {
    try {
        log.info('start </geteco> command processing...');
        log.debug('ctx.chat: ', ctx.chat);
        const imageURL = "http://www.ecopress.by/cgi/vitebsk.php";
        //let imageURL = "https://octodex.github.com/images/Fintechtocat.png";

        const { token } = ctx.telegram;
        //debug( '/geteco', token );
        const { apiRoot } = ctx.tg?.options;
        const { id: chat_id } = ctx.chat;
        uploadPhoto(
            { token, apiRoot, chat_id },
            imageURL
        );
    }
    catch (error) {
        log.error('catch-handler:cmd:geteco\n', error );
    }
};
