import mongoose, { Mongoose } from 'mongoose';

import { default as infoOfDBtoConsole } from './info-of-db';

import { consoleLogger } from '../helpers/';

const log = consoleLogger( 'DB:' );


class AppMongoose extends Mongoose {

}

export default function (
    uri: string,
    title: string
) {
    const connection = mongoose.createConnection( uri, {});

    // CONNECTION EVENTS
    connection.on( 'connected', () => {
        const { host, port } = connection;
        log.debug( `${title} - connected to ${host}:${port}` );
        infoOfDBtoConsole( connection );
    });

    connection.on( 'error', (err: any) => {
        log.error( `${title} - connection error:\n`, err );
    });

    connection.on( 'disconnecting', () => {
        log.debug( `${title} connection closing ...` );
    });

    connection.on( 'disconnected', () => {
        log.info( `${title} disconnected from MongoDB.` );
    });

    connection.on( 'close', () => {
        log.info( `${title} connection closed.` );
    });

    // connection.closeConn = () => {
    //     return new Promise( (resolve) =>
    //         connection.close( () => resolve( title ))
    //     );
    // };

    return connection;
};
