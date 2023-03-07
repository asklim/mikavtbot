import { Telegraf } from 'telegraf';
import {
    debugFactory,
    Logger,
    securifyToken
} from '<srv>/helpers/';

import {
    END_POINTS,
    TELEGRAM_API_ROOT,
} from './telegram-endpoints';

const debug = debugFactory('tbot:mikav');
const log = new Logger('mikaV:');

export default class MikaVTelegraf extends Telegraf {

    private startTimestamp: number | undefined;

    async launchBot () {

        //debug( this.token );  // ok and equal
        //debug( this.telegram.token );
        try {
            await this.launch();

            this.startTimestamp = Date.now();
            let info;
            info = await this.telegram.getWebhookInfo();
            log.info('webhook Info: ', info );

            info = await this.telegram.getMe();
            log.info('Me: ', info );

            return Promise.resolve( this );
        }
        catch (err) {
            log.error('telegram-bot.launchBot error:\n', err );
        }
    }

    public getStartTime (): number | undefined {
        return this.startTimestamp;
    }

    private getTgToken (): string {
        return this.telegram?.token;
    }

    private getTgApiRoot (): string {
        return this.telegram?.options?.apiRoot;
    }


    public getEndpointURL (
        endPoint: string,
        botIdAndToken?: string
    ) {
        let token: string = '',
            apiRoot,
            action;
        try {
            token = botIdAndToken ?? this.getTgToken();
            apiRoot = this.getTgApiRoot() ?? TELEGRAM_API_ROOT;
            action = END_POINTS[ endPoint.toLowerCase() ];

            return ( !!apiRoot && !!token && !!action ?
                `${apiRoot}/bot${token}${action}`
                : void 0
            );
        }
        catch (e) {
            log.error('typeof this', typeof this,
                '\napiRoot', apiRoot,
                '\ntoken', securifyToken( token ),
                '\naction', action
            );
        }
    }
}
