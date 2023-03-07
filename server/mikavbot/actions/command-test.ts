import { Logger, debugFactory } from '<srv>/helpers/';
import { uploadTestPhoto } from '<srv>/helpers/upload-photo';

const log = new Logger('mikaV:');
const debug = debugFactory('!actions:cmd:test');


/**  Замыкание переменной для сохранения значений между вызовами */
let testFileId: any;

export default async (ctx: any) => {
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
