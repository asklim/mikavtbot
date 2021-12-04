const debug = require( 'debug' )( 'actions:cmd:test' );

const { consoleLogger, } = require( '../helpers' );
const log = consoleLogger( 'mikaV:' );

//const { uploadTestPhoto, } = require( '../actions' );

module.exports = async (ctx) => {
    try {
        debug( '/test command' );
        //debug( 'url:', bot.getEndpointURL( 'sendPhoto' ));
        const TEST_FILE_ID = 'AgACAgIAAxkDAAMEYCkHCRlpDVTcqjSIMCJOp2GSQ1Q'+
            'AAh2yMRtab0hJKrUGJVvGQl_YUFWZLgADAQADAgADbQADBeYEAAEeBA';
        const tgMsg = await ctx.replyWithPhoto( TEST_FILE_ID );

        debug( tgMsg );

        /*const { token } = ctx.telegram;
        const { apiRoot } = ctx.tg.options;
        const { id: chat_id } = ctx.chat;
        uploadTestPhoto( { token, apiRoot, chat_id } );*/
    }
    catch (error) {
        log.error( 'catch-handler:cmd:test\n', error );
    }
};
