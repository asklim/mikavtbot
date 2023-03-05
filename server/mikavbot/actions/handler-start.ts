import { default as debugFactory } from 'debug';
const debug = debugFactory('actions:start');

import { consoleLogger } from '../../helpers/';

const log = consoleLogger('mikaV:');

export default async (ctx: any) => {
    try {
        debug('start command');
        ctx.replyWithHTML('<b>Hello</b>');
    }
    catch (error) {
        log.error('catch-handler:start\n', error );
    }
};
