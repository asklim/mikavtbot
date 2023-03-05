import { default as debugFactory } from 'debug';
const debug = debugFactory('actions:help');

import { consoleLogger } from '../../helpers/';

const log = consoleLogger( 'mikaV:' );

export default async (ctx: any) => {
    try {
        debug( 'help command' );
        ctx.replyWithHTML( '<b>Help Text</b>' );
    }
    catch (error) {
        log.error( 'catch-handler:help\n', error );
    }
};
