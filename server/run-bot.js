

const { bot:mikavbot } = require( './telegram-bot.js' );


mikavbot.launch().then(
    () => {

        mikavbot.telegram.getWebhookInfo()
        .then(

            info => console.log( 'webhook Info: ', info )
        
        );

        mikavbot.telegram.getMe()
        .then(

            info => console.log( 'Me: ', info )

        );
});

