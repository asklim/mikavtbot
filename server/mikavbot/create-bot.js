const debug = require( 'debug' )( 'tbot:mikav' );

const actions = require( './actions' );
const commandGeteco = require( './actions/command-geteco.ts' );

const {
    consoleLogger,
} = require( '../helpers' );

const log = consoleLogger( 'mikaV:' );

const { MikaVTelegraf } = require( './telegram-bot.js' );



module.exports.createBot = async function (authToken) {

    const bot = new MikaVTelegraf( authToken );

    //debug( 'sendPhoto url:', bot.getEndpointURL( 'sendPhoto' ));

    bot.start( actions.handler_start );


    bot.help( actions.handler_help );


    bot.command( '/geteco', commandGeteco );


    bot.command( '/test', actions.command_test );


    bot.on( 'text', actions.handler_on_text );


    bot.on( 'message', actions.handler_on_message );


    bot.use( (ctx, next) => {
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

