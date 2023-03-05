import { default as debugFactory } from 'debug';
const debug = debugFactory('actions:cmd:geteco');

import { uploadPhoto } from '../../helpers/upload-photo';

import { consoleLogger } from '../../helpers/';
const log = consoleLogger('mikaV:');

//import { Context } from 'telegraf';


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
