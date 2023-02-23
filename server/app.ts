//const debug = require( 'debug' )( 'tbot:app' );

const createError = require( 'http-errors' );
const express = require( 'express' );
//const path = require( 'path' );
const cookieParser = require( 'cookie-parser' );
const morgan = require( 'morgan' );

//const { icwd } = require( './helpers/' );

const { NODE_ENV } = process.env;

// NODE_ENV может быть undefined в продакшене для выполнения debug()
// 'development', 'test' - Для разработки + debug()
// 'production' - production without debug()
// 'undefined'  - production with debug()
const BOT_ID_TOKEN = (NODE_ENV == undefined || NODE_ENV == 'production')
    ? process.env.MIKAVBOT_TOKEN
    : process.env.MIKAHOMEBOT_TOKEN;

if( !BOT_ID_TOKEN ) {
    throw new Error({
        // выводит в консоль: Error: [object Object]
        isLocal: false,
        errmsg: 'No auth token for Telegram.',
        toString: function() { return this.errmsg; },
        // Error: undefined, if toString: () => this.errmsg, // this===undefined
    });
}

(async function () {
    const bot = require( './bot-launcher.js' );
    /*let mikavbot =*/ await bot.runBot( BOT_ID_TOKEN );
    //debug( 'mikavbot is', mikavbot ); // Telegraf
    //debug( 'mikavbot.getBot is', bot.getBot() ); // Telegraf
})();


const {
    createDatabasesConnections,
    databasesShutdown,
} = require( './databases/' );

createDatabasesConnections();

const tbpiRouter = require( './api/tbpi-router.js' );
const indexRouter = require( './api/index-router.js' );
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
app.use( function(req, res, next ) {

    next( createError( 404 ), req, res );
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use( function( err, req, res, _next ) {

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 ).end();
    //res.render( 'error' );
});


module.exports = {
    app,
    databasesShutdown,
};
