import mongoose, {
    version
} from 'mongoose';

import { default as infoOfDBtoConsole } from './info-of-db';

import { Logger } from '<srv>/helpers/';

const log = new Logger('DB:');
log.debug(`Mongoose version: ${version}`);


export default function (
    uri: string,
    title: string
) {
    const connection = mongoose.createConnection( uri, {});

    // CONNECTION EVENTS
    connection.on('connected', () => {
        const { host, port } = connection;
        log.debug(`${title} - connected to ${host}:${port}`);
        infoOfDBtoConsole( connection );
    });

    connection.on('error', (err: Error) => {
        log.error(`${title} - connection error:\n`, err );
    });

    connection.on('disconnecting', () => {
        log.debug(`${title} connection closing ...`);
    });

    connection.on('disconnected', () => {
        log.info(`${title} disconnected from MongoDB.`);
    });

    connection.on('close', () => {
        log.info(`${title} connection closed.`);
    });

    // connection.closeConn = () => {
    //     return new Promise( (resolve) =>
    //         connection.close( () => resolve( title ))
    //     );
    // };

    return connection;
}
