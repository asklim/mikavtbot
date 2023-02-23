// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require('debug')('actions:ontext');
const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uploadTest... Remove this comment to see the full error message
    uploadTestPhoto
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../helpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger('mikaV:');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async (ctx: any) => {
    //  Простые смайлики приходят сюда.
    try {
        const { message } = ctx;
        const { token } = ctx.telegram;
        //const { apiRoot } = ctx.tg.options;
        const { id: chat_id } = ctx.chat;
        const { text } = message;

        debug(`on(text) event: ${text}\n`, message );

        if( !text ) {
            return ctx.reply('This is not a text.');
        }

        if( text == 'test') {
            uploadTestPhoto({ token, /*apiRoot,*/ chat_id });
        }
        else {
            ctx.reply( `Hello (text), ${text}` );
        }
    }
    catch (error) {
        log.error('catch-handler: on(text)\n', error );
    }
};
