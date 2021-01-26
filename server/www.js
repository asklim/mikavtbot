#!/usr/bin/env node

require( 'dotenv' ).config();

const {
    app: expressBot,
    databasesShutdown, 
} = require( './app.js' );

const debug = require( 'debug' )('rsis:www');
const http = require( 'http' );
const os = require( 'os' );
const util = require( 'util' );
const colors = require( 'colors' );

const { icwd } = require( './helpers/serverconfig' );
//const icwd = require( 'fs' ).realpathSync( process.cwd() );

const version = require( `${icwd}/package.json` ).version;

const { bot:mikavbot } = require( './telegram-bot.js' );

//console.log( process.env );

let { PWD, USER, NAME, } = process.env;

let userInfo = util.format( '%O', os.userInfo() );

console.log( `package.json dir is ${icwd}`.red ); // = '/app'
console.log( `PWD (${__filename}) is ${PWD}`.red );
console.log( `USER @ NAME is ${USER} @ ${NAME}`.red );
console.log( `platform is ${os.platform()}, hostname is ${os.hostname()}`.cyan );
console.log( colors.yellow( 'User Info : ', userInfo ));



/*******************************************************
 * Get port from environment and store in Express.
 */
const port = normalizePort( process.env.PORT || '3569' );
expressBot.set( 'port', port );



/**
 * Create HTTP server.
 */
const server = http.createServer( expressBot );


const shutdownTheServer = async () => 
{ 
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


const handleOnListening = () => {

    /**
     * Event listener for HTTP server "listening" event.
     */

    let addr = server.address();
    let bind = typeof addr === 'string' 
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

    console.log( 'http-server closing ....' );
});



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen( port,  () => {

    serverAppOutput( 'addr'/*'full'*/, version, server );
});


// *************************************************************
// CAPTURE APP TERMINATION / RESTART EVENTS

// For nodemon restarts
process.once( 'SIGUSR2', () => {

    databasesShutdown( 'nodemon restart', 
        () => { 
            shutdownTheServer()
            .then( () => {
                process.kill( process.pid, 'SIGUSR2' ); 
            });
        });
});

// For app termination
process.on( 'SIGINT', () => {

    mikavbot.stop( 'SIGINT' );

    databasesShutdown( 'app termination', () => {

        shutdownTheServer()
        .then( () => { 
            process.exit(0); 
        });
    });
});

// For Heroku app termination
process.on( 'SIGTERM', () => {

    mikavbot.stop( 'SIGTERM' );

    databasesShutdown( 'Heroku app termination', () => {

        shutdownTheServer()
        .then( () => { 
            process.exit(0); 
        });
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
    /*if( isNaN( port ) ) {  // named pipe     
        return val;
    }
    if( port >= 0 ) {     // port number        
        return port;
    }
    return false;*/
}


/**
 * 
 * @param {*} outputMode 
 * @param {*} appVersion 
 * @param {*} httpServer 
 */
function serverAppOutput (outputMode, appVersion, httpServer) {  
    

    const serverAddress = httpServer.address();
    const { 
        address, 
        family, 
        port 
    } = serverAddress;

    const bind = typeof serverAddress === 'string' 
        ? 'pipe ' + serverAddress
        : 'port ' + port;    

    const outputs = {
        full: () => console.log( 'Express server = ',  httpServer ),
        addr: () => {
            const { NODE_ENV } = process.env;
            console.log( 'app version ', appVersion.cyan );
            console.log( 'NODE Environment is ', NODE_ENV );
            console.log(
                'Express server = "' + address.cyan 
                + '" Family= "' + family.cyan 
                + '" listening on ' + bind.cyan 
            );
        },
        default: () => console.log( '\n' )
    };  

    (outputs[ outputMode.toLowerCase() ] || outputs[ 'default' ])();
}
