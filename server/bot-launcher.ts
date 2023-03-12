import {
//     Logger,
    debugFactory
} from '<srv>/helpers/';
const debug = debugFactory('tbot:launcher');
// const log = new Logger('TBot:');

import {
    createBot,
    MikaVTelegraf
} from '<srv>/mikavbot/';

let mikavbot: MikaVTelegraf | undefined;

async function runBot (
    botIdAndToken: string
) {

    if( process.env.BOT_MODE == 'OFF' ) {
        return undefined;
    }
    if( mikavbot ) {
        return mikavbot;
    }

    mikavbot = await createBot( botIdAndToken );
    /*const launched =*/ await mikavbot?.launchBot?.();
    //debug('runBot', mikavbot == launched ); // true
    //debug('runBot', mikavbot === launched );// true
    //debug('launched is', typeof launched ); // object

    const dt = new Date( mikavbot.getStartTime() ?? 0);
    debug('Bot started at', dt.toUTCString());

    return mikavbot;
}

const getBot = () => mikavbot;


export {
    runBot,
    getBot,
};
