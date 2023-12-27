import mongoose, {
    version
} from 'mongoose';

import { default as infoOfDBtoConsole } from './info-of-db';

import { Logger } from '<srv>/helpers/';

const log = new Logger('storage [CC]:');
log.debug(`Mongoose version: ${version}`);


export default function createMongooseConnToDB (
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

    // @ts-expect-error closeConn don`t defined in mongoose.Connection
    connection.closeConn = async () => {
        await connection.close();
        return title;
    };

    return connection;
}
