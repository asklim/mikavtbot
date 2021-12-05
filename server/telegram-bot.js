const debug = require( 'debug' )( 'tbot' );

const actions = require( './actions' );

const {
    consoleLogger,
    securetizeToken,
} = require( './helpers' );

const log = consoleLogger( 'mikaV:' );

const END_POINTS = require( './telegram-endpoints' );

const { Telegraf } = require( 'telegraf' );


Telegraf.prototype.getEndpointURL = function (endPoint) {

    let token, apiRoot, action;
    try {
        token = this.token;
        apiRoot = this.telegram.options.apiRoot;
        action = END_POINTS[ endPoint.toLowerCase() ];

        return ( token && apiRoot && action
            ? `${apiRoot}/bot${token}${action}`
            : void 0
        );
    }
    catch (e) {
        debug( 'typeof this', typeof this,
            '\napiRoot', apiRoot,
            '\ntoken', securetizeToken( token ),
            '\naction', action
        );
    }
};

const { NODE_ENV } = process.env;

// NODE_ENV может быть undefined в продакшене для выполнения debug()
const AUTH_TOKEN = (NODE_ENV == undefined || NODE_ENV == 'production')
    ? process.env.MIKAVBOT_TOKEN
    : process.env.MIKAHOMEBOT_TOKEN;
if( !AUTH_TOKEN ) {
    throw new Error( 'No auth token for Telegram.');
}

const bot = new Telegraf( AUTH_TOKEN );


//debug( 'sendPhoto url:', bot.getEndpointURL( 'sendPhoto' ));

bot.start( actions.handler_start );


bot.help( actions.handler_help );


bot.command( '/geteco', actions.command_geteco );


bot.command( '/test', actions.command_test );


bot.on( 'text', actions.handler_on_text );


bot.on( 'message', actions.handler_on_message );


bot.use( (ctx, next) => {
    try {
        debug( 'ctx:\n', ctx );
        //ctx.reply( `echo: ${message?.text}` );
        if( next ) { return next(); }
    }
    catch (error) {
        log.error( 'catch-handler:use(default)\n', error );
    }
});


module.exports = { bot };
