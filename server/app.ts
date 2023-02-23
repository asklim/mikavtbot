//const debug = require( 'debug' )( 'tbot:app' );

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createError = require( 'http-errors' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'express'.
const express = require( 'express' );
//const path = require( 'path' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const cookieParser = require( 'cookie-parser' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const morgan = require( 'morgan' );

//const { icwd } = require( './helpers/' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NODE_ENV'.
const { NODE_ENV } = process.env;

// NODE_ENV может быть undefined в продакшене для выполнения debug()
// 'development', 'test' - Для разработки + debug()
// 'production' - production without debug()
// 'undefined'  - production with debug()
const BOT_ID_TOKEN = (NODE_ENV == undefined || NODE_ENV == 'production')
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    ? process.env.MIKAVBOT_TOKEN
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    : process.env.MIKAHOMEBOT_TOKEN;

if( !BOT_ID_TOKEN ) {
    // @ts-expect-error TS(2345): Argument of type '{ isLocal: boolean; errmsg: stri... Remove this comment to see the full error message
    throw new Error({
        // выводит в консоль: Error: [object Object]
        isLocal: false,
        errmsg: 'No auth token for Telegram.',
        // @ts-expect-error TS(2339): Property 'errmsg' does not exist on type 'String'.
        toString: function() { return this.errmsg; },
        // Error: undefined, if toString: () => this.errmsg, // this===undefined
    });
}

(async function () {
    // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const bot = require( './bot-launcher.js' );
    /*let mikavbot =*/ await bot.runBot( BOT_ID_TOKEN );
    //debug( 'mikavbot is', mikavbot ); // Telegraf
    //debug( 'mikavbot.getBot is', bot.getBot() ); // Telegraf
})();


const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createData... Remove this comment to see the full error message
    createDatabasesConnections,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databasesS... Remove this comment to see the full error message
    databasesShutdown,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( './databases/' );

createDatabasesConnections();

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const tbpiRouter = require( './api/tbpi-router.js' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const indexRouter = require( './api/index-router.js' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const usersRouter = require( './api/users-router.js' );

const app = express();

app.set( 'BOT_ID_TOKEN', BOT_ID_TOKEN );

// view engine setup
//app.set( 'views', path.join( '../views' ));
//app.set( 'view engine', 'ejs' );

const morganTemplate = [
    '[:date[web]]', ':status',
    //':remote-addr', ':remote-user',
    ':method :url :response-time[0] ms - :res[content-length]'
].join(' ');
app.use( morgan( morganTemplate ));


app.use( express.json());
app.use( express.urlencoded({ extended: false }));
app.use( cookieParser());
app.use( express.static( `../public` ));

app.use( '/tbpi', tbpiRouter );
app.use( '/users', usersRouter );

app.use( '/', indexRouter );

// catch 404 and forward to error handler
app.use( function(req: any, res: any, next: any ) {

    next( createError( 404 ), req, res );
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use( function( err: any, req: any, res: any, _next: any ) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 ).end();
    //res.render( 'error' );
});


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    app,
    databasesShutdown,
};
