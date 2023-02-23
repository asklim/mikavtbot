#!/usr/bin/env node
require( 'dotenv' ).config();

const debug = require( 'debug' )( 'tbot:www' );
const http = require( 'http' );
const os = require( 'os' );
const util = require( 'util' );
const colors = require( 'colors' );
const {
    icwd,
    getProcessEnvWithout,
} = require( './helpers/' );

const version = require( '../package.json' ).version;


outputStartServerInfo();

const {
    app: expressNodejs,
    databasesShutdown,
} = require( './app.js' );

const botLauncher = require( './bot-launcher.js' );
//debug( 'botLauncher.getBot is', botLauncher ); // { runBot: [...], getBot: [...] }

/*******************************************************
 * Get port from environment and store in Express.
 */
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
const handleOnError = (error) => {

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
        : 'port ' + addr.port;

    debug( 'Listening on ' + bind );
};


server.on( 'error', handleOnError );

server.on( 'listening', handleOnListening );

server.on( 'clientError', (err, socket) => {

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
process.once( 'SIGUSR2', () => {

    const mikavbot = botLauncher.getBot();
    mikavbot?.stop( 'SIGUSR2' );

    databasesShutdown( 'SIGUSR2 - nodemon restart',
        () => {
            shutdownTheServer()
            .then( () => {
                process.kill( process.pid, 'SIGUSR2' );
            });
        });
});


// For app termination
process.on( 'SIGINT', () => {

    const mikavbot = botLauncher.getBot();
    //debug( 'typeof mikavbot is', typeof mikavbot ); // object
    mikavbot?.stop( 'SIGINT' );

    databasesShutdown( 'SIGINT app termination', () => {

        shutdownTheServer()
        .then(
            function () {
                setTimeout(
                    () => { process.exit(0); },
                    500
                );
            }
        );
    });
});


// For Heroku app termination
process.on( 'SIGTERM', () => {

    const mikavbot = botLauncher.getBot();
    mikavbot && mikavbot.stop( 'SIGTERM' );

    databasesShutdown( 'SIGTERM app termination', () => {

        shutdownTheServer()
        .then(
            function () {
                setTimeout(
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
function normalizePort (val) {

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
function outputServerAppInfo (outputMode, appVersion, httpServer) {

    const serverAddress = httpServer.address();
    let outputs;

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
                    + '" listening on ' + bind.cyan,
                    '\n'
                );
            },
            default: () => console.log( '\n' )
        };
    }
    (outputs[ outputMode.toLowerCase() ] || outputs[ 'default' ])();
}


async function outputStartServerInfo() {

    getProcessEnvWithout( 'npm_, XDG, LESS' ).
    then( (envList) => {
        console.log( envList );

        const { PWD, USER, NAME, } = process.env;
        const userInfo = util.format( '%O', os.userInfo() );

        console.log( `stdout.isTTY is ${process.stdout.isTTY}`.yellow );
        // true - in terminal, undefined - in service journal

        console.log( `package.json dir is ${icwd}`.red ); // = '/app'
        console.log( `PWD (${__filename}) is ${PWD}`.red );
        console.log( `USER @ NAME is ${USER} @ ${NAME}`.red );
        console.log( `platform is ${os.platform()}, hostname is ${os.hostname()}`.cyan );
        console.log( colors.yellow( 'User Info : ', userInfo ), '\n' );
    });
}
