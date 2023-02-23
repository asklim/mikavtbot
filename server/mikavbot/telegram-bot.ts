// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'tbot:mikav' );

const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securetize... Remove this comment to see the full error message
    securetizeToken,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( '../helpers' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'mikaV:' );

const {
    END_POINTS,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TELEGRAM_A... Remove this comment to see the full error message
    TELEGRAM_API_ROOT,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( './telegram-endpoints.js' );

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Telegraf } = require( 'telegraf' );


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'MikaVTeleg... Remove this comment to see the full error message
class MikaVTelegraf extends Telegraf {
    launch: any;
    telegram: any;

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


    static getEndpointURL (endPoint: any, botIdAndToken: any) {

        let token, apiRoot, action;
        try {
            // @ts-expect-error TS(2339): Property 'token' does not exist on type 'typeof Mi... Remove this comment to see the full error message
            token = botIdAndToken || this?.token;
            // @ts-expect-error TS(2339): Property 'telegram' does not exist on type 'typeof... Remove this comment to see the full error message
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


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    MikaVTelegraf,
};
