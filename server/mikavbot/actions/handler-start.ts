
import { Logger, debugFactory } from '<srv>/helpers/';

const debug = debugFactory('actions:start');
const log = new Logger('mikaV:');

export default async (ctx: any) => {
    try {
        debug('start command');
        ctx.replyWithHTML('<b>Hello</b>');
    }
    catch (error) {
        log.error('catch-handler:start\n', error );
    }
};
