const debug = require( 'debug' )( 'tbot:mikav' );

const {
    consoleLogger,
    securetizeToken,
} = require( '../helpers' );

const log = consoleLogger( 'mikaV:' );

const {
    END_POINTS,
    TELEGRAM_API_ROOT,
} = require( './telegram-endpoints.js' );

const { Telegraf } = require( 'telegraf' );


class MikaVTelegraf extends Telegraf {

    async launchBot () {

        //debug( this.token );  // ok and equal
        //debug( this.telegram.token );
        try {
            await this.launch();

            let info;
            info = await this.telegram.getWebhookInfo();
            log.info( 'webhook Info: ', info );

            info = await this.telegram.getMe();
            log.info( 'Me: ', info );

            return Promise.resolve( this );
        }
        catch (err) {
            log.error( 'telegram-bot.launchBot error:\n', err );
        }
    }


    static getEndpointURL (endPoint, botIdAndToken) {

        let token, apiRoot, action;
        try {
            token = botIdAndToken || this?.token;
            apiRoot = this?.telegram?.options?.apiRoot || TELEGRAM_API_ROOT;
            action = END_POINTS[ endPoint.toLowerCase() ];

            return ( apiRoot && token && action
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
    }

}


module.exports = {
    MikaVTelegraf,
};
