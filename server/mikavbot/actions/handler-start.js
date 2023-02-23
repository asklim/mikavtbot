const debug = require( 'debug' )( 'actions:start' );
const { consoleLogger, } = require( '../../helpers' );

const log = consoleLogger( 'mikaV:' );

module.exports = async (ctx) => {
    try {
        debug( 'start command' );
        ctx.replyWithHTML( '<b>Hello</b>' );
    }
    catch (error) {
        log.error( 'catch-handler:start\n', error );
    }
};
