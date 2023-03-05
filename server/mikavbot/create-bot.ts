import { default as debugFactory } from 'debug';
const debug = debugFactory('tbot:createbot');

import * as actions from './actions/';

import {
    consoleLogger,
    securifyToken
} from '../helpers/';
const log = consoleLogger('mikaV:');

import { default as MikaVTelegraf } from './telegram-bot';


export default async function createBot (
    authToken: string
): Promise<MikaVTelegraf> {

    const bot = new MikaVTelegraf( authToken );

    debug('sendPhoto url:', securifyToken( bot.getEndpointURL('sendPhoto'),42,13 ));

    bot.start( actions.handler_start );


    bot.help( actions.handler_help );


    bot.command('/geteco', actions.command_geteco );


    bot.command('/test', actions.command_test );


    bot.on('text', actions.handler_on_text );


    bot.on('message', actions.handler_on_message );


    bot.use( (ctx: any, next: any) => {
        try {
            log.debug('last handler (.use)! ctx:\n', ctx );
            if( next ) { return next(); }
        }
        catch (error) {
            log.error('catch-handler:use(default)\n', error );
        }
    });

    return bot;
};
