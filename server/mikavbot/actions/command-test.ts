// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require('debug')('!actions:cmd:test');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
const { consoleLogger, } = require('../../helpers/');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uploadTest... Remove this comment to see the full error message
const { uploadTestPhoto, } = require('../../helpers/upload-photo.js');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger('mikaV:');


/**  Замыкание переменной для сохранения значений между вызовами */
let testFileId: any;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async (ctx: any) => {
    try {
        debug(`"/test" command; testFileId is ${typeof testFileId}`);
        if( !testFileId ) {

            const { token } = ctx.telegram;
            //const { apiRoot } = ctx.tg.options;
            const { id: chat_id } = ctx.chat;
            testFileId = await uploadTestPhoto({ token, /*apiRoot,*/ chat_id });
            return;
        }
        const tgMsg = await ctx.replyWithPhoto( testFileId );
        debug( tgMsg );
    }
    catch (error) {
        log.error('catch-handler:cmd:test\n', error );
    }
};
