import { Context } from 'telegraf';
import { message } from 'telegraf/filters';

import {
    debugFactory,
    Logger,
    securifyToken
} from '<srv>/helpers/';

import { default as MikaVTelegraf } from './mikavtelegraf';
import * as actions from './actions/';

const debug = debugFactory('tbot:createbot');
const log = new Logger('mikaV:');


export default async function createBot (
    authToken: string
)
: Promise<MikaVTelegraf>
{
    const bot = new MikaVTelegraf( authToken );

    bot.start( actions.handler_start );


    bot.help( actions.handler_help );


    bot.command('geteco', actions.command_geteco );


    bot.command('test', actions.command_test );


    bot.on( message('text'), actions.handler_on_text );


    bot.on('message', actions.handler_on_message );


    bot.use( (ctx: Context, next: ()=>Promise<void>) => {
        try {
            log.debug('last handler (.use)! ctx:\n', ctx );
            if( next ) { return next(); }
        }
        catch (error) {
            log.error('catch-handler in bot.use(), (default)\n', error );
        }
    });

    debug('sendPhoto url:', securifyToken( bot.getEndpointURL('sendPhoto'),42,13 ));

    return bot;
}
