// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'actions:start' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
const { consoleLogger, } = require( '../../helpers' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'mikaV:' );

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async (ctx: any) => {
    try {
        debug( 'start command' );
        ctx.replyWithHTML( '<b>Hello</b>' );
    }
    catch (error) {
        log.error( 'catch-handler:start\n', error );
    }
};
