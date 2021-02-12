const { 
    consoleLogger,
} = require( '../helpers' );
const log = consoleLogger( 'DB:' );

const mongoose = require( 'mongoose' );
const infoOfDBtoConsole = require( './info-of-db' );


module.exports.createConn = function (uri, title) {

    const connection = mongoose.createConnection( uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true, 
    });
    const { host, port } = connection;

    // CONNECTION EVENTS
    connection.on( 'connected', () => {
        log.info( `${title} - connected to ${host}:${port}` );
        infoOfDBtoConsole( connection );
    });

    connection.on( 'error', (err) => {
        log.error( `${title} - connection error:\n`, err );
    });

    connection.on( 'disconnecting', () => {
        log.info( `${title} connection closing ...` );
    });  

    connection.on( 'disconnected', () => {
        log.info( `${title} disconnected from MongoDB.` );
    });

    connection.on( 'close', () => {
        log.info( `${title} connection closed.` );
    });

    connection.closeConn = () => {
        return new Promise( (resolve) => 
            connection.close( () => resolve( title ))
        );
    };

    return connection;
};
