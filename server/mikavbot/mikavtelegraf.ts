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

const d = debugFactory('tbot:mikav');
const log = new Logger('mikaV:');

export default class MikaVTelegraf extends Telegraf {

    private startTimestamp: number | undefined;

    async launchBot () {

        d('launchBot/1/, token:', securifyToken( this.telegram.token ));
        try {
            /*** Make SURE that next line WITHOUT await keyword  */
            this.launch();
            this.startTimestamp = Date.now();

            const whInfo = await this.telegram.getWebhookInfo();
            log.info('webhook Info: ', whInfo );

            const meInfo = await this.telegram.getMe();
            log.info('Me: ', meInfo );

            // d('launchBot/2/, botInfo', this.botInfo );
            // const dt = new Date( this.startTimestamp );
            // d('launchBot/3/, started at', dt.toUTCString());

            return this;
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
        let token = '',
            apiRoot,
            action;
        try {
            token = botIdAndToken ?? this.getTgToken();
            apiRoot = this.getTgApiRoot() ?? TELEGRAM_API_ROOT;
            action = END_POINTS[ endPoint.toLowerCase() ];

            return ( !!apiRoot && !!token && !!action ?
                `${apiRoot}/bot${token}${action}`
                : undefined
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
