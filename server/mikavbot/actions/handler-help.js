const debug = require( 'debug' )( 'actions:help' );
const { consoleLogger, } = require( '../../helpers' );

const log = consoleLogger( 'mikaV:' );

module.exports = async (ctx) => {
    try {
        debug( 'help command' );
        ctx.replyWithHTML( '<b>Help Text</b>' );
    }
    catch (error) {
        log.error( 'catch-handler:help\n', error );
    }
};
