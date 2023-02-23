const debug = require( 'debug' )( 'actions:onmessage' );
const { consoleLogger, } = require( '../../helpers' );

const log = consoleLogger( 'mikaV:' );


module.exports = async (ctx) => {

    // sticker (big animated smilik)
    // tg messages aka 'You added MIKA Home Bot'

    try {
        //debug( `on(message) event\n`, ctx.message );

        const { sticker } = ctx.message;
        //400 bad request: message text is empty
        if( !sticker ) {
            throw new Error({
                isLocal: true,
                errmsg:'No .sticker in ctx.message'
            });
        }
        ctx.replyWithHTML( `<b>This is message, ${sticker.set_name}</b>` );
    }
    catch (error) {
        if( error.isLocal ){
            debug( `on(message) event: ${error.errmsg}\n`, ctx.message );
            return;
        }
        log.error( 'catch-handler:on(message)\n', error );
    }
};
