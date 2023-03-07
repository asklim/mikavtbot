import { default as createError } from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// import {
//     Logger,
//     //debugFactory
// } from '<srv>/helpers/';
// const debug = debugFactory('tbot:app');

import { default as app } from '<srv>/expressApp/';


import tbpiRouter from './api/tbpi-router';
import indexRouter from './api/index-router';
import usersRouter from './api/users-router';

const { NODE_ENV } = process.env;

const isProduction = NODE_ENV == 'production';

// NODE_ENV может быть undefined в продакшене для выполнения debug()
// 'development', 'test' - Для разработки + debug()
// 'production' - production without debug()
// 'undefined'  - production with debug()
const BOT_ID_TOKEN = ( NODE_ENV == undefined || isProduction )
    ? process.env.MIKAVBOT_TOKEN
    : process.env.MIKAHOMEBOT_TOKEN;

if( !BOT_ID_TOKEN ) {
    throw new Error('No auth token for Telegram.');
}

(async function () {
    const bot = await import('./bot-launcher');
    /*let mikavbot =*/ await bot.runBot( BOT_ID_TOKEN );
    //debug( 'mikavbot is', mikavbot ); // Telegraf
    //debug( 'mikavbot.getBot is', bot.getBot() ); // Telegraf
})();


app.set('BOT_ID_TOKEN', BOT_ID_TOKEN );

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
app.use( express.static(`../public`));

app.use('/tbpi', tbpiRouter );
app.use('/users', usersRouter );

app.use('/', indexRouter );

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


export default app;
