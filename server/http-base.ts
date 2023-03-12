#!/usr/bin/env node

import http from 'node:http';
import { Duplex } from 'node:stream';

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

const debug = debugFactory('app:http');


/*******************************************************
 * Get port from environment and store in Express.
 */

// const PORT = normalizePort( env.PORT );
const { PORT } = env;
expressNodejs.set('port', PORT );
expressNodejs.set('botVersion', botVersion );

debug('express.settings', securifyObjByList(
    expressNodejs?.settings,
    ['BOT_ID_TOKEN']
));

interface ExtendedError extends Error {
    code?: string;
}

/**
 * Create HTTP server.
 */
const server = http.createServer( expressNodejs );
initSetupServer();
initSetupProcess();


/**
 * Listen on provided port, on all network interfaces.
 */
export function startServer () {
    server.listen( PORT,  () => {
        showServerAppInfo('addr'/*'full'*/, botVersion, server );
    });
}

/***************************** **********************/


async function shutdownTheServer () {
    return server.
    close( () => {
        console.log( 'http-server closed now.' );
    });
}


function initSetupServer () {

    /** Event listener for HTTP server "error" event.
     */
    const handleOnError = (error: ExtendedError) => {

        // const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

        // handle specific listen errors with friendly messages
        switch( error?.code ) {

            case 'EACCES':
                console.error(`Port ${PORT} requires elevated privileges`);
                process.exit(1);
                break;

            case 'EADDRINUSE':
                console.error(`Port ${PORT} is already in use`);
                process.exit(1);
                break;

            default:
                throw error;
        }
    };

    /** Event listener for HTTP server "listening" event.
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

    server.on('clientError', (err: Error, socket: Duplex) => {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    server.on('close', () => {
        console.log('http-server closing ...');
    });
}


function initSetupProcess () {

    // CAPTURE APP TERMINATION / RESTART EVENTS
    const OK_EXIT_CODE = 0;

    // For app termination
    process.on('SIGINT', async () => {
        console.log('\b\b\x20\x20');
        console.log('Got SIGINT signal (^C)!\n');

        const mikavbot = botLauncher.getBot();
        //debug( 'typeof mikavbot is', typeof mikavbot ); // object
        mikavbot?.stop('SIGINT');

        await shutdownTheServer();
        await databasesShutdown(
            'SIGINT, app termination',
            () => {
                //console.log(`Process finished (pid:${process.pid}, exit code: 0).`);
                //setTimeout( process.exit, 500, OK_EXIT_CODE );
            }
        );
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
            () => {
                setTimeout( process.exit, 500, OK_EXIT_CODE );
            }
        );
    });


    // For nodemon restarts
    process.once('SIGUSR2', async () => {

        const mikavbot = botLauncher.getBot();
        mikavbot?.stop('SIGUSR2');

        await shutdownTheServer();
        await databasesShutdown(
            'SIGUSR2, nodemon restart',
            () => {
                setTimeout( process.kill, 500, process.pid, 'SIGUSR2');
            }
        );
    });
}


// /**
//  * Normalize a port into a number, string, or false.
//  */
// function normalizePort (val: unknown)
// : number | string | boolean
// {
//     const port = parseInt( <string>val, 10 );
//     return isNaN( port )
//         ? <string> val       // named pipe
//         : port >= 0
//             ? port  // port number
//             : false
//     ;
// }
