//const debug = require( 'debug' )( 'tbot:run' );
//const { consoleLogger } = require( './helpers' );
//const log = consoleLogger( 'TBot:' );

let mikavbot;

async function runBot( botIdAndToken ) {

    if( mikavbot ) {
        return Promise.resolve( mikavbot );
    }
    const { BOT_MODE } = process.env;

    if( BOT_MODE == undefined || BOT_MODE != 'OFF' ) {

        const { createBot } = require( './mikavbot/create-bot.js' );
        const bot = await createBot( botIdAndToken );
        mikavbot = bot;
        /*const launched =*/ await mikavbot.launchBot();
        //debug( 'runBot', mikavbot == launched ); // true
        //debug( 'runBot', mikavbot === launched );// true
        //debug( 'launched is', typeof launched ); // object
    }

    return Promise.resolve( mikavbot );
}

const getBot = () => mikavbot;


module.exports = {
    runBot,
    getBot,
};
