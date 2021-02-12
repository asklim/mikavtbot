const { consoleLogger } = require( './helpers' );
const log = consoleLogger( 'TBot:' );

const { bot:mikavbot } = require( './telegram-bot.js' );


mikavbot.launch()
.then( async () => {

    let info;
    info = await mikavbot.telegram.getWebhookInfo();
    
    log.info( 'webhook Info: ', info );

    info = await mikavbot.telegram.getMe();

    log.info( 'Me: ', info );

})
.catch( (error) => {

    log.error( 'mikavbot error:\n', error );
});

