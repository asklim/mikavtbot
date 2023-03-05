import { default as debugFactory } from 'debug';
const debug = debugFactory('actions:onmessage');

import { consoleLogger } from '../../helpers/';

const log = consoleLogger('mikaV:');

import { Context } from 'telegraf';

export default async (ctx: Context) => {

    // sticker (big animated smilik)
    // tg messages aka 'You added MIKA Home Bot'

    try {
        log.info('start <message> processing...');
        debug(`on(message) event\n`, ctx.message );

        //const { sticker } = ctx.message;
        //400 bad request: message text is empty
        // if( !sticker ) {
        //     throw new Error('No .sticker in ctx.message');
        // }
        // ctx.replyWithHTML(`<b>This is message, ${sticker.set_name}</b>`);
        ctx.replyWithHTML(`<b>This is message, ${typeof ctx.message}</b>`);
    }
    catch (error) {
        log.error(`ctx.message`, ctx.message );
        log.error('catch-handler:on(message)\n', error );
    }
};
