
const { bot:mikavbot } = require( './telegram-bot.js' );


mikavbot.launch()
.then( async () => {

    let info;
    info = await mikavbot.telegram.getWebhookInfo();
    
    console.log( 'webhook Info: ', info );

    info = await mikavbot.telegram.getMe();

    console.log( 'Me: ', info );

});

