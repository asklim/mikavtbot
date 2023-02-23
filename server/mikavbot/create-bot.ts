// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'tbot:mikav' );

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const actions = require( './actions' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const commandGeteco = require( './actions/command-geteco.ts' );

const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( '../helpers' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'mikaV:' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MikaVTeleg... Remove this comment to see the full error message
const { MikaVTelegraf } = require( './telegram-bot.js' );



// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.createBot = async function (authToken: any) {

    const bot = new MikaVTelegraf( authToken );

    //debug( 'sendPhoto url:', bot.getEndpointURL( 'sendPhoto' ));

    bot.start( actions.handler_start );


    bot.help( actions.handler_help );


    bot.command( '/geteco', commandGeteco );


    bot.command( '/test', actions.command_test );


    bot.on( 'text', actions.handler_on_text );


    bot.on( 'message', actions.handler_on_message );


    bot.use( (ctx: any, next: any) => {
        try {
            debug( 'last handler (.use)! ctx:\n', ctx );
            if( next ) { return next(); }
        }
        catch (error) {
            log.error( 'catch-handler:use(default)\n', error );
        }
    });

    return bot;
};

