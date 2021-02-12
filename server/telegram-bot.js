const debug = require( 'debug' )( 'tbot' );
const {    
    uploadTestPhoto,
    uploadPhoto,
} = require( './actions' );
const {
    consoleLogger,
} = require( './helpers' );

const log = consoleLogger( 'mikaV:' );

const { Telegraf } = require( 'telegraf' );
const bot = new Telegraf( process.env.MIKAVBOT_TOKEN );


bot.start( (ctx) => {
    try {
        debug( 'start command' );
        ctx.replyWithHTML( '<b>Hello</b>' );
    }
    catch (error) {
        log.error( 'handler:start', error );
    }
});


bot.help( (ctx) => { 
    try {
        debug( 'help command' );
        ctx.replyWithHTML( '<b>Help Text</b>' );
    }
    catch (error) {
        log.error( 'handler:help', error );
    }
});


bot.command( '/geteco', (ctx) => { 
    try {
        debug( '/geteco command' );
        debug( 'ctx.chat: ', ctx.chat );
        const imageURL = "http://www.ecopress.by/cgi/vitebsk.php";
        //let imageURL = "https://octodex.github.com/images/Fintechtocat.png";

        const { token } = ctx.telegram;
        const { apiRoot } = ctx.tg.options;
        const { id: chat_id } = ctx.chat; 

        uploadPhoto( { token, apiRoot, chat_id }, imageURL );
    }
    catch (error) {
        log.error( 'handler:cmd:geteco', error );
    }
});


bot.command( '/test', (ctx) => { 
    try {
        debug( '/test command' );

        const { token } = ctx.telegram;
        const { apiRoot } = ctx.tg.options;
        const { id: chat_id } = ctx.chat; 

        uploadTestPhoto( { token, apiRoot, chat_id } );
    }
    catch (error) {
        log.error( 'handler:cmd:test', error );
    }
});


bot.on( 'text', (ctx) => {
    try {
        const { reply, message } = ctx;
        const { token } = ctx.telegram;
        const { apiRoot } = ctx.tg.options;
        const { id: chat_id } = ctx.chat; 

        debug( `on(text) event: ${message.text}` );

        //TODO: no .text properties ????
        if( message.text == 'test') {

            uploadTestPhoto( { token, apiRoot, chat_id } );
        }
        else {
            reply( 'Hello ' + message.text );
        }
    }
    catch (error) {
        log.error( 'handler:on(text)', error );
    }
});


bot.on( 'message', (ctx) => {  // sticker or smilik
    try {
        debug( `on(message) event` );
        ctx.replyWithHTML( '<b>This is message</b>' );
        
        if( ctx.message.text ) { 
            ctx.reply( ctx.message.text ); 
            //400 bad request: message text is empty
        }
    }
    catch (error) {
        log.error( 'handler:on(message)', error );
    }
});


bot.use( ({ reply, message }, next) => {
    try {
        debug( message );
        reply( `echo: ${message.text}` );
        
        if( next ) { next(); }
    }
    catch (error) {
        log.error( 'handler:use(default)', error );
    }    
});


module.exports = { bot };
