#!/usr/bin/env node
//import '.';

import http from 'node:http';
import { showServerAppInfo } from './helpers/startup/';

import {
    env,
    botVersion,
    debugFactory,
    securifyObjByList
} from '<srv>/helpers/';

import expressNodejs from './app';
import { databasesShutdown } from './databases/';

import * as botLauncher from './bot-launcher';

const debug = debugFactory('tbot:www');


/*******************************************************
 * Get port from environment and store in Express.
 */

const port = normalizePort( env.PORT ?? '3569');
expressNodejs.set('port', port );
expressNodejs.set('botVersion', botVersion );

debug('express.settings', securifyObjByList(
    expressNodejs?.settings,
    ['BOT_ID_TOKEN']
));


/**
 * Create HTTP server.
 */
const server = http.createServer( expressNodejs );


const shutdownTheServer = async () => {

    return await server.close( () => {
        console.log( 'http-server closed now.' );
    });
};


/**
 * Event listener for HTTP server "error" event.
 *
 */
const handleOnError = (error: any) => {

    if( error.syscall !== 'listen' ) {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch( error.code ) {

        case 'EACCES':
            console.error( bind + ' requires elevated privileges' );
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error( bind + ' is already in use' );
            process.exit(1);
            break;

        default:
            throw error;
    }
};


/**
 * Event listener for HTTP server "listening" event.
 */
const handleOnListening = () => {

    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr?.port;

    debug(`Listening on ${bind}`);
};


server.on('error', handleOnError );

server.on('listening', handleOnListening );

server.on('clientError', (err: any, socket: any) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.on('close', () => {
    console.log('http-server closing ...');
});


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen( port,  () => {
    showServerAppInfo('addr'/*'full'*/, botVersion, server );
});


// *************************************************************
// CAPTURE APP TERMINATION / RESTART EVENTS

// For nodemon restarts
process.once('SIGUSR2', async () => {

    const mikavbot = botLauncher.getBot();
    mikavbot?.stop('SIGUSR2');

    await shutdownTheServer();
    databasesShutdown(
        'SIGUSR2, nodemon restart',
        async () => {
            setTimeout( process.kill, 500, process.pid, 'SIGUSR2');
        }
    );
});


const OK_EXIT_CODE = 0;

// For app termination
process.on('SIGINT', async () => {
    console.log('\b\b\x20\x20');
    console.log('Got SIGINT signal (^C)!\n');

    const mikavbot = botLauncher.getBot();
    //debug( 'typeof mikavbot is', typeof mikavbot ); // object
    mikavbot?.stop('SIGINT');

    await shutdownTheServer();
    databasesShutdown('SIGINT, app termination', ()=>{} );
    console.log(`Process finished (pid:${process.pid}, exit code: 0).`);
    process.exit( OK_EXIT_CODE );
});


// For Heroku app termination
process.on('SIGTERM', async () => {

    const mikavbot = botLauncher.getBot();
    mikavbot?.stop('SIGTERM');

    await shutdownTheServer();
    await databasesShutdown(
        'SIGTERM, app termination',
        async () => {
            setTimeout( process.exit, 500, OK_EXIT_CODE );
        }
    );
});



/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val: any) : number | string | boolean {

    let port = parseInt( val, 10 );

    return isNaN( port )
        ? val       // named pipe
        : port >= 0
            ? port  // port number
            : false
    ;
}
