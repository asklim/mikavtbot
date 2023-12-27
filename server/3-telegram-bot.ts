import {
    Logger,
    debugFactory
} from '<srv>/helpers/';
const d = debugFactory('tbot:tbot');
const log = new Logger('TgBot:');

import {
    createBot,
    MikaVTelegraf
} from '<srv>/mikavbot/';



let mikavbot: MikaVTelegraf | undefined;

const getBot = () => mikavbot;


async function runBot (
    botIdAndToken: string
) {

    if( process.env.BOT_MODE == 'OFF' ) {
        return undefined;
    }
    if( mikavbot ) {
        return mikavbot;
    }
    try {
        mikavbot = await createBot( botIdAndToken );
        // throw new Error('runBot test error invoke.');
        await mikavbot?.launchBot();
        return mikavbot;
    }
    catch (err) {
        if( err ) {
            log.error('runBot: catch error\n', err );
            // throw err;
        }
    }
}


async function startBot (
    tgToken: string,
    logger = log
) {
    try {
        const theBot = await runBot( tgToken );

        //console.log('bot === mikav:', getBot() === mikavbot ); //true
        if( theBot ) {
            const dt = new Date( theBot.getStartTime?.() ?? 0);
            d('Bot started at', dt.toUTCString());
        }
        else {
            logger.info('Bot is OFF');
        }
        //debug( 'mikavbot is', mikavbot ); // Telegraf
        //debug( 'mikavbot.getBot is', getBot() ); // Telegraf
    }
    catch (err) {
        if( err ) {
            logger.error('startBot: catch error\n', err );
        }
    }
}


export {
    //runBot,
    getBot,
    startBot
};
