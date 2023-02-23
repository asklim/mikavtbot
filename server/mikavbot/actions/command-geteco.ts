const debug = require('debug')('actions:cmd:geteco');

const {
    consoleLogger,
} = require('../../helpers');

const { uploadPhoto, } = require('../../helpers/upload-photo.js');
const log = consoleLogger('mikaV:');


module.exports = async (ctx) => {
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
