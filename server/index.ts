#!/usr/bin/env node
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require( 'dotenv' ).config();

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'tbot:www' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'http'.
const http = require( 'http' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const os = require( 'os' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const util = require( 'util' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const colors = require( 'colors' );
const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'icwd'.
    icwd,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getProcess... Remove this comment to see the full error message
    getProcessEnvWithout,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( './helpers/' );

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const version = require( '../package.json' ).version;


outputStartServerInfo();

const {
    app: expressNodejs,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databasesS... Remove this comment to see the full error message
    databasesShutdown,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( './app.js' );

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const botLauncher = require( './bot-launcher.js' );
//debug( 'botLauncher.getBot is', botLauncher ); // { runBot: [...], getBot: [...] }

/*******************************************************
 * Get port from environment and store in Express.
 */
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const port = normalizePort( process.env.PORT || '3569' );
expressNodejs.set( 'port', port );


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
            // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error( bind + ' is already in use' );
            // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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
        : 'port ' + addr.port;

    debug( 'Listening on ' + bind );
};


server.on( 'error', handleOnError );

server.on( 'listening', handleOnListening );

server.on( 'clientError', (err: any, socket: any) => {

    socket.end( 'HTTP/1.1 400 Bad Request\r\n\r\n' );
});

server.on( 'close', () => {

    console.log( 'http-server closing ...' );
});



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen( port,  () => {
    outputServerAppInfo( 'addr'/*'full'*/, version, server );
});


// *************************************************************
// CAPTURE APP TERMINATION / RESTART EVENTS

// For nodemon restarts
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.once( 'SIGUSR2', () => {

    const mikavbot = botLauncher.getBot();
    mikavbot?.stop( 'SIGUSR2' );

    databasesShutdown( 'SIGUSR2 - nodemon restart',
        () => {
            shutdownTheServer()
            .then( () => {
                // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
                process.kill( process.pid, 'SIGUSR2' );
            });
        });
});


// For app termination
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.on( 'SIGINT', () => {

    const mikavbot = botLauncher.getBot();
    //debug( 'typeof mikavbot is', typeof mikavbot ); // object
    mikavbot?.stop( 'SIGINT' );

    databasesShutdown( 'SIGINT app termination', () => {

        shutdownTheServer()
        .then(
            function () {
                setTimeout(
                    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
                    () => { process.exit(0); },
                    500
                );
            }
        );
    });
});


// For Heroku app termination
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
process.on( 'SIGTERM', () => {

    const mikavbot = botLauncher.getBot();
    mikavbot && mikavbot.stop( 'SIGTERM' );

    databasesShutdown( 'SIGTERM app termination', () => {

        shutdownTheServer()
        .then(
            function () {
                setTimeout(
                    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
                    () => { process.exit(0); },
                    500
                );
            }
        );
    });
});



/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val: any) {

    let port = parseInt( val, 10 );

    return isNaN( port )
        ? val       // named pipe
        : port >= 0
            ? port  // port number
            : false
    ;
}


/**
 * Выводит информацию о сервере и
 * его окружении в консоль
 * ---
 * @param {string} outputMode - 'full' | 'addr' | ''
 * @param {string} appVersion
 * @param {http.Server} httpServer
 */
function outputServerAppInfo (outputMode: any, appVersion: any, httpServer: any) {

    const serverAddress = httpServer.address();
    let outputs;

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    const node_env = process.env.NODE_ENV || 'undefined';

    if( serverAddress === 'string' ) {
        const bind = serverAddress;
        outputs = {
            full: () => console.log( 'Express server = ',  httpServer, '\n' ),
            addr: () => {
                console.log( '\napp version', appVersion.cyan );
                console.log( 'NODE Environment is', node_env.cyan );
                console.log( 'Express server listening on ' + bind.cyan, '\n' );
            },
            default: () => console.log( '\n' )
        };
    }
    else {
        const {
            address,
            family,
            port
        } = serverAddress;

        const bind = 'port ' + port;

        outputs = {
            full: () => console.log( 'Express server = ',  httpServer, '\n' ),
            addr: () => {
                console.log( '\napp version', appVersion.cyan );
                console.log( 'NODE Environment is', node_env.cyan );
                console.log(
                    'Express server = "' + address.cyan
                    + '" Family= "' + family.cyan
                    // @ts-expect-error TS(2339): Property 'cyan' does not exist on type 'string'.
                    + '" listening on ' + bind.cyan,
                    '\n'
                );
            },
            default: () => console.log( '\n' )
        };
    }
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    (outputs[ outputMode.toLowerCase() ] || outputs[ 'default' ])();
}


async function outputStartServerInfo() {

    getProcessEnvWithout( 'npm_, XDG, LESS' ).
    then( (envList: any) => {
        console.log( envList );

        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        const { PWD, USER, NAME, } = process.env;
        const userInfo = util.format( '%O', os.userInfo() );

        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        console.log( `stdout.isTTY is ${process.stdout.isTTY}`.yellow );
        // true - in terminal, undefined - in service journal

        // @ts-expect-error TS(2339): Property 'red' does not exist on type 'string'.
        console.log( `package.json dir is ${icwd}`.red ); // = '/app'
        // @ts-expect-error TS(2304): Cannot find name '__filename'.
        console.log( `PWD (${__filename}) is ${PWD}`.red );
        // @ts-expect-error TS(2339): Property 'red' does not exist on type 'string'.
        console.log( `USER @ NAME is ${USER} @ ${NAME}`.red );
        // @ts-expect-error TS(2339): Property 'cyan' does not exist on type 'string'.
        console.log( `platform is ${os.platform()}, hostname is ${os.hostname()}`.cyan );
        console.log( colors.yellow( 'User Info : ', userInfo ), '\n' );
    });
}
