// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require('debug')('actions:cmd:geteco');

const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require('../../helpers');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uploadPhot... Remove this comment to see the full error message
const { uploadPhoto, } = require('../../helpers/upload-photo.js');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger('mikaV:');


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async (ctx: any) => {
    try {
        debug('/geteco command');
        debug('ctx.chat: ', ctx.chat);
        const imageURL = "http://www.ecopress.by/cgi/vitebsk.php";
        //let imageURL = "https://octodex.github.com/images/Fintechtocat.png";

        const { token } = ctx.telegram;
        //debug( '/geteco', token );
        const { apiRoot } = ctx.tg.options;
        const { id: chat_id } = ctx.chat;
        uploadPhoto( { token, apiRoot, chat_id }, imageURL );
    }
    catch (error) {
        log.error('catch-handler:cmd:geteco\n', error );
    }
};
