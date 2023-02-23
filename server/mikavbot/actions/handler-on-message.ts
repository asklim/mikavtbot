// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'actions:onmessage' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
const { consoleLogger, } = require( '../../helpers' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'mikaV:' );


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async (ctx: any) => {

    // sticker (big animated smilik)
    // tg messages aka 'You added MIKA Home Bot'

    try {
        //debug( `on(message) event\n`, ctx.message );

        const { sticker } = ctx.message;
        //400 bad request: message text is empty
        if( !sticker ) {
            // @ts-expect-error TS(2345): Argument of type '{ isLocal: boolean; errmsg: stri... Remove this comment to see the full error message
            throw new Error({
                isLocal: true,
                errmsg:'No .sticker in ctx.message'
            });
        }
        ctx.replyWithHTML( `<b>This is message, ${sticker.set_name}</b>` );
    }
    catch (error) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        if( error.isLocal ){
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            debug( `on(message) event: ${error.errmsg}\n`, ctx.message );
            return;
        }
        log.error( 'catch-handler:on(message)\n', error );
    }
};
