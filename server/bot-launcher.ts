//const debug = require( 'debug' )( 'tbot:run' );
//const { consoleLogger } = require( './helpers' );
//const log = consoleLogger( 'TBot:' );

let mikavbot: any;

async function runBot( botIdAndToken: any ) {

    if( mikavbot ) {
        return Promise.resolve( mikavbot );
    }
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const { BOT_MODE } = process.env;

    if( BOT_MODE == undefined || BOT_MODE != 'OFF' ) {

        // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
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


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    runBot,
    getBot,
};
