import process from 'node:process';
import http from 'node:http';
import * as fs from 'node:fs';
import { Duplex } from 'node:stream';

import { showServerAppInfo } from './helpers/startup';

import {
    env,
    botVersion,
    debugFactory,
    Logger,
    securifyObjByList
} from '<srv>/helpers/';

import { databasesShutdown } from './databases/';

import expressNodejs from './2-app';
import * as telegramBot from './3-telegram-bot';

const d = debugFactory('app:http');
const log = new Logger('[http-base]');

d('express.settings', securifyObjByList(
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
function startServer () {
    server.listen( env.PORT,  () => {
        showServerAppInfo('addr'/*'full'*/, botVersion, server );
    });
}

export {
    startServer,
};

/***************************************************/


interface ExtendedError extends Error {
    code?: string;
}

async function shutdownTheServer () {
    return server.
    close( (err) => {
        if( err ) {
            log.error('Error of closing server.\n', err );
            return;
        }
        log.info('http-server closed now.');
    });
}


function initialSetupServer () {

    /**
     * Event listener for HTTP server "error" event.
     */
    const handleOnError = (error: ExtendedError) => {

        // const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

        // handle specific listen errors with friendly messages
        switch( error?.code ) {

            case 'EACCES':
                log.error(`Port ${env.PORT} requires elevated privileges`);
                process.exit(1);
                break;

            case 'EADDRINUSE':
                log.error(`Port ${env.PORT} is already in use`);
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
        const bind = typeof addr === 'string' ?
            'pipe ' + addr
            : 'port ' + addr?.port;

        d(`Listening on ${bind}`);
    };

    server.on('error', handleOnError );

    server.on('listening', handleOnListening );

    server.on('clientError', (_err: Error, socket: Duplex) => {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    server.on('close', () => {
        log.info('http-server closing ...');
    });
}

const OK_EXIT_CODE = 0;
const ERROR_EXIT_CODE = 1;

function initialSetupProcess () {
    // CAPTURE APP TERMINATION / RESTART EVENTS

    process.on('unhandledRejection', async (reason, promise) => {
        log.trace('Unhandled Rejection at:\n', promise, 'reason:\n', reason );
        // Application specific logging, throwing an error, or other logic here
        await processShutdown('unhandledRejection', ERROR_EXIT_CODE );
    });

    process.on('uncaughtException', async (err, origin) => {
        fs.writeSync( process.stderr.fd,
            `Caught exception: ${err}\n` +
            `Exception origin: ${origin}`
        );
        // Application specific logging, throwing an error, or other logic here
        await processShutdown('uncaughtException', ERROR_EXIT_CODE );
    });

    const blankTwoChars = () => console.log('\b\b\x20\x20');

    // For app termination
    process.on('SIGINT', async () => {
        blankTwoChars();
        log.info('Got SIGINT signal (^C)!\n');

        await processShutdown('SIGINT', OK_EXIT_CODE );
        // try {
        //     const mikavbot = telegramBot.getBot();
        //     //debug( 'typeof mikavbot is', typeof mikavbot ); // object
        //     mikavbot?.stop('SIGINT');

        //     await shutdownTheServer();
        //     exitCode = OK_EXIT_CODE;
        //     await databasesShutdown(
        //         'SIGINT, app termination',
        //         () => {
        //             setTimeout( process.exit, 500, exitCode );
        //         }
        //     );
        // }
        // catch (err) {
        //     log.error('error in SIGINT handler:\n', err );
        //     exitCode = ERROR_EXIT_CODE;
        // }
        // finally {
        //     log.info(`Process finished (pid:${process.pid}, exit code: ${exitCode}).`);
        //     (exitCode !== OK_EXIT_CODE) && process.exit( exitCode );
        // }
    });


    // For Heroku app termination
    process.on('SIGTERM', async () => {
        await processShutdown('SIGTERM', OK_EXIT_CODE );
        // try {
        //     const mikavbot = telegramBot.getBot();
        //     mikavbot?.stop('SIGTERM');

        //     await shutdownTheServer();
        //     exitCode = OK_EXIT_CODE;
        //     await databasesShutdown(
        //         'SIGTERM, app termination',
        //         () => {
        //             setTimeout( process.exit, 500, exitCode );
        //         }
        //     );
        // }
        // catch (err) {
        //     log.error('error in SIGTERM handler:\n', err );
        //     exitCode = ERROR_EXIT_CODE;
        // }
        // finally {
        //     log.info(`Process finished (pid:${process.pid}, exit code: ${exitCode}).`);
        //     (exitCode !== OK_EXIT_CODE) && process.exit( exitCode );
        // }
    });

    let exitCode: number;

    // For nodemon restarts
    process.once('SIGUSR2', async () => {
        try {
            const mikavbot = telegramBot.getBot();
            mikavbot?.stop('SIGUSR2');

            await shutdownTheServer();
            exitCode = OK_EXIT_CODE;
            await databasesShutdown(
                'SIGUSR2, nodemon restart',
                () => {
                    setTimeout( process.kill, 500, process.pid, 'SIGUSR2');
                }
            );
        }
        catch (err) {
            log.error('error in SIGUSR2 handler:\n', err );
            exitCode = ERROR_EXIT_CODE;
        }
        finally {
            log.info(`Process finished (pid:${process.pid}, exit code: ${exitCode}).`);
            process.exit( exitCode );
        }
    });
}


async function processShutdown (
    reason: string,
    exitCode: number
) {
    try {
        const mikavbot = telegramBot.getBot();
        //debug( 'typeof mikavbot is', typeof mikavbot ); // object
        mikavbot?.stop(`${reason}`);

        await shutdownTheServer();
        await databasesShutdown(
            `${reason}, app termination`,
            () => {
                setTimeout( process.exit, 500, exitCode );
            }
        );
    }
    catch (err) {
        log.error(`error in ${reason} handler:\n`, err );
        exitCode = ERROR_EXIT_CODE;
    }
    finally {
        log.info(`Process finished (pid:${process.pid}, exit code: ${exitCode}).`);
        (exitCode !== OK_EXIT_CODE) && process.exit( exitCode );
    }
}
