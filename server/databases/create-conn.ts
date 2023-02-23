const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
    consoleLogger,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( '../helpers/' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'log'.
const log = consoleLogger( 'DB:' );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mongoose'.
const mongoose = require( 'mongoose' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const infoOfDBtoConsole = require( './info-of-db' );


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (uri: any, title: any) {

    const connection = mongoose.createConnection( uri, {});

    // CONNECTION EVENTS
    connection.on( 'connected', () => {
        const { host, port } = connection;
        log.info( `${title} - connected to ${host}:${port}` );
        infoOfDBtoConsole( connection );
    });

    connection.on( 'error', (err: any) => {
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
