import { default as debugFactory } from 'debug';
const debug = debugFactory('actions:ontext');

import { consoleLogger } from '../../helpers/';

import { uploadTestPhoto } from '../../helpers/upload-photo';
const log = consoleLogger('mikaV:');

export default async (ctx: any) => {
    //  Простые смайлики приходят сюда.
    try {
        const { message } = ctx;
        const { token } = ctx.telegram;
        //const { apiRoot } = ctx.tg.options;
        const { id: chat_id } = ctx.chat;
        const { text } = message;

        debug(`on(text) event: ${text}\n`, message );

        if( !text ) {
            return ctx.reply('This is not a text.');
        }

        if( text == 'test') {
            uploadTestPhoto({ token, /*apiRoot,*/ chat_id });
        }
        else {
            ctx.reply( `Hello (text), ${text}` );
        }
    }
    catch (error) {
        log.error('catch-handler: on(text)\n', error );
    }
};
