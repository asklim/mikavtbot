// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'actions:help' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
const { consoleLogger, } = require( '../../helpers' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'mikaV:' );

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async (ctx: any) => {
    try {
        debug( 'help command' );
        ctx.replyWithHTML( '<b>Help Text</b>' );
    }
    catch (error) {
        log.error( 'catch-handler:help\n', error );
    }
};
