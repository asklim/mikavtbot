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

import * as telegramBot from './telegram-bot';

const debug = debugFactory('app:http');


debug('express.settings', securifyObjByList(
    expressNodejs?.settings,
    ['BOT_ID_TOKEN']
));

/**
 * Create HTTP server.
 */
const server = http.createServer( expressNodejs );
initialSetupServer();
initialSetupProcess();


/**
 * Listen on provided port, on all network interfaces.
 */
export function startServer () {
    server.listen( env.PORT,  () => {
        showServerAppInfo('addr'/*'full'*/, botVersion, server );
    });
}


/***************************************************/


interface ExtendedError extends Error {
    code?: string;
}

async function shutdownTheServer () {
    return server.
    close( (err) => {
        if( err ) {
            console.log('Error of closing server.\n', err );
            return;
        }
        console.log('http-server closed now.');
    });
}


function initialSetupServer () {

    /** Event listener for HTTP server "error" event.
     */
    const handleOnError = (error: ExtendedError) => {

        // const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

        // handle specific listen errors with friendly messages
        switch( error?.code ) {

            case 'EACCES':
                console.error(`Port ${env.PORT} requires elevated privileges`);
                process.exit(1);
                break;

            case 'EADDRINUSE':
                console.error(`Port ${env.PORT} is already in use`);
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


function initialSetupProcess () {

    // CAPTURE APP TERMINATION / RESTART EVENTS
    const OK_EXIT_CODE = 0;

    // For app termination
    process.on('SIGINT', async () => {
        console.log('\b\b\x20\x20');
        console.log('Got SIGINT signal (^C)!\n');

        const mikavbot = telegramBot.getBot();
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

        const mikavbot = telegramBot.getBot();
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

        const mikavbot = telegramBot.getBot();
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
