const debug = require( 'debug' )('tbot');

const { Telegraf } = require( 'telegraf' );
const bot = new Telegraf( process.env.MIKAVBOT_TOKEN );

const {

    uploadTestPhoto,
    uploadPhoto,

} = require('./helpers/upload-photo.js');



bot.start( (ctx) => {

    debug( 'start command' );
    ctx.replyWithHTML( '<b>Hello</b>' );

});



bot.help( (ctx) => { 

    debug( 'help command' );
    ctx.replyWithHTML( '<b>Help Text</b>' );

});



bot.command( '/geteco', (ctx) => { 


    debug( '/geteco command' );
    //debug( 'ctx.chat: ', ctx.chat );
    let imageURL = "http://www.ecopress.by/cgi/vitebsk.php";
    //let imageURL = "https://octodex.github.com/images/Fintechtocat.png";

    let { token } = ctx.telegram;
    let { apiRoot } = ctx.tg.options;
    let { id: chat_id } = ctx.chat; 

    uploadPhoto( { token, apiRoot, chat_id }, imageURL );  

});




bot.command( '/test', (ctx) => { 


    debug( '/test command' );

    let { token } = ctx.telegram;
    let { apiRoot } = ctx.tg.options;
    let { id: chat_id } = ctx.chat; 

    uploadTestPhoto( { token, apiRoot, chat_id } );
});




bot.on( 'text', (ctx) => {


    let { reply, message } = ctx;
    let { token } = ctx.telegram;
    let { apiRoot } = ctx.tg.options;
    let { id: chat_id } = ctx.chat; 

    debug( `onText event: ${message.text}` );

    if( message.text == 'test') {

        uploadTestPhoto( { token, apiRoot, chat_id } );
    }
    else {
        reply( 'Hello ' + message.text );
    }
});




bot.on( 'message', (ctx) => {  // sticker or smilik


    debug( `onMessage event` );
    ctx.replyWithHTML( '<b>This is message</b>' );
    
    if( ctx.message.text ) 
    { 
        ctx.reply( ctx.message.text ); 
        //400 bad request: message text is empty
    }
});



bot.use( ({ reply, message }, next) => {

    debug( message );
    reply( `echo: ${message.text}` );
    
    if( next ) { next(); }
});

//bot.hears( 'hi', ({ replyWithHTML }) => replyWithHTML('<b>Hello</b>'));
//debug('telegraf bot: ', bot);


module.exports = { bot };
