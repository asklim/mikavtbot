// import { default as debugFactory } from 'debug';
// const debug = debugFactory('tbot:run');

// import { consoleLogger } from './helpers/';
// const log = consoleLogger('TBot:');

import createBot from './mikavbot/create-bot';

let mikavbot: any;

async function runBot (botIdAndToken: string) {

    if( process.env.BOT_MODE == 'OFF' ) {
        return void 0;
    }
    if( mikavbot ) {
        return mikavbot;
    }

    mikavbot = await createBot( botIdAndToken );
    /*const launched =*/ await mikavbot.launchBot();
    //debug( 'runBot', mikavbot == launched ); // true
    //debug( 'runBot', mikavbot === launched );// true
    //debug( 'launched is', typeof launched ); // object


    return mikavbot;
}

const getBot = () => mikavbot;


export {
    runBot,
    getBot,
};
