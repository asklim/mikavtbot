import {
    Logger,
} from '<srv>/helpers/';

const log = new Logger('storage:');

import { Connection } from 'mongoose';


const dbs: {
    [key: string]: Connection | null | undefined
} = {
    botmain: null
};

/**
 * @summary Возвращает указанную базу данных
 * * return The connection to database
*/
async function getDB()
/* : Promise<Connection | undefined> */ {
    // log.debug('dbs', dbs );
    await createDatabasesConnections();
    return dbs.botmain;
}

async function createDatabasesConnections() {
    if( !dbs.botmain ) {
        dbs.botmain = (await import('./db-mikavbot')).default;
    }
}


// To be called when process is restarted Nodemon or terminated

async function databasesShutdown (
    msg: string,
    next: () => void | undefined
) {
    try {
        const dbsTitles: string[] = [];
        for (
            const dbKey in dbs
        ) {
            const db = dbs[ dbKey ];
            // @ts-expect-error closeConn don`t exist on type mongoose.Connection
            const title = await db.closeConn();
            dbsTitles.push( title );
        }
        log.info('dbs closed: ', dbsTitles );
        log.info(`Mongoose disconnected through ${msg}`);
    }
    catch (error) {
        log.error('databases shutdown error\n', error );
    }
    finally {
        next?.();
    }
}

( async () => {
    await createDatabasesConnections();
})();

export {
    getDB,
    createDatabasesConnections,
    databasesShutdown
};
