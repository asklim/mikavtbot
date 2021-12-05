const debug = require( 'debug' )( '!actions:cmd:test' );

const { consoleLogger, } = require( '../helpers' );
const log = consoleLogger( 'mikaV:' );

const { uploadTestPhoto, } = require( './upload-photo' );

/**  Замыкание переменной для сохранения значений между вызовами */
let testFileId;

module.exports = async (ctx) => {
    try {
        debug( '"/test" command; testFileId is', typeof testFileId );
        if( !testFileId ) {

            const { token } = ctx.telegram;
            const { apiRoot } = ctx.tg.options;
            const { id: chat_id } = ctx.chat;
            testFileId = await uploadTestPhoto( { token, apiRoot, chat_id } );
            return;
        }
        const tgMsg = await ctx.replyWithPhoto( testFileId );
        debug( tgMsg );
    }
    catch (error) {
        log.error( 'catch-handler:cmd:test\n', error );
    }
};
