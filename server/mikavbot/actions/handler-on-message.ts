
import { Context } from 'telegraf';

import { Logger, debugFactory } from '<srv>/helpers/';

const log = new Logger('onMessage:');
const d = debugFactory('actions:onmessage');

import type {
    Message,
    CommonMessageBundle,
} from 'typegram';
// import type { Chat, User, Document, } from 'typegram';
// interface ctxMessage {
//     message_id: number,
//     date: number,
//     chat: Chat.PrivateChat,
//     from?: User,
//     document?: Document,
// }

type ctxMessage = CommonMessageBundle | undefined;

export default async function botEvent_onMessage_handler (ctx: Context) {

    // sticker (big animated smilik)
    // tg messages aka 'You added MIKA Home Bot'

    const message: ctxMessage = ctx.message;

    try {
        log.info('start <message> processing...');
        d(`on(message) event\n`, message );

        //const { sticker } = ctx.message;
        //400 bad request: message text is empty
        // if( !sticker ) {
        //     throw new Error('No .sticker in ctx.message');
        // }
        // ctx.replyWithHTML(`<b>This is message, ${sticker.set_name}</b>`);
        ctx.replyWithHTML( messageReply( message ));
        log.info('replied with HTML.');
    }
    catch (error) {
        log.error(`ctx.message`, message );
        log.error('catch-handler:on(message)\n', error );
    }
}


function messageReply (message: ctxMessage) {

    const { document } = message as Message.DocumentMessage;
    if ( document ) {
        return JSON.stringify( document, null, 2 );
    }
    return `<b>This is message, ${typeof message}</b>`;
}
