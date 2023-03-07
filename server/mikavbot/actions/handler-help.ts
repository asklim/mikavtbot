import { Logger, debugFactory } from '<srv>/helpers/';

const debug = debugFactory('actions:help');
const log = new Logger('mikaV:');

export default async (ctx: any) => {
    try {
        debug('help command');
        ctx.replyWithHTML('<b>Help Text</b>');
    }
    catch (error) {
        log.error('catch-handler:help\n', error );
    }
};
