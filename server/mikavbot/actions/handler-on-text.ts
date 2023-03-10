import { Logger, debugFactory } from '<srv>/helpers/';
import { uploadTestPhoto } from '<srv>/helpers/upload-photo';

const debug = debugFactory('actions:ontext');
const log = new Logger('mikaV:');


export default async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any
) => {
    //  Простые смайлики приходят сюда.
    try {
        const { message } = ctx;
        const { token } = ctx.telegram;
        const { id: chat_id } = ctx.chat;
        const { text } = message;

        debug(`on(text) event: ${text}\n`, message );

        if( !text ) {
            return ctx.reply('This is not a text.');
        }

        if( text == 'test') {
            uploadTestPhoto({ token, chat_id });
        }
        else {
            ctx.reply( `Hello (text), ${text}` );
        }
    }
    catch (error) {
        log.error('catch-handler: on(text)\n', error );
    }
};
