import { default as debugFactory } from 'debug';
const debug = debugFactory('dbs:info');

import {
    Connection
//    , Model
} from 'mongoose';
import { formatWithOptions } from 'util';
import {
    Logger,
    IConsoleLogger
} from '../helpers/';


/**
 * Выводит адрес/имя_db, массив имен моделей
 * и количество документов в их коллекциях
*/
export default async function (
    mongooseConnection: Connection
) {
    //debug( `Mongoose version ${mongooseConnection.base.version}` );

    const { host, port, db, id } = mongooseConnection;
    debug(`Mongoose connection id: ${id}`);

    const title = `dbinfo: ${host}:${port}/${db.databaseName}`;
    const log = new Logger(`${title}:`);

    async function * theModels(
        models: string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) : any {
        for(
            const modelName of models
        ) {
            yield mongooseConnection.model( modelName );
        }
    }

    try {
        const models = mongooseConnection.modelNames().sort();
        //массив имен моделей (Строки)
        //debug( `${title}: model's count = ${models.length}` );
        //debug( `${title}:`, models );

        const infoDocs = [];
        // for( let modelName of models ) {
        //     let theModel = mongooseConnection.model( modelName );
        //     let count = await theModel.countDocuments({});
        //     let elem = [ modelName, count ];
        //     infoDocs.push( elem );
        // }

        for await(
            const theModel of theModels( models )
        ) {
            const count = <number>( await theModel.countDocuments({}));
            const tuple = [ theModel.modelName, count ];
            infoDocs.push( tuple );
        }

        logging( infoDocs, log, 'v2' );
        // console.log( `${title}:\n`,
        //     formatWithOptions( { colors: true }, '%O', infoDocs )
        // );
    }
    catch (error) {
        console.log( 'info-of-db.ts - catch block');
        log.error( error );
    }
}


function logging (
    docs: (string | number)[][],
    logger: IConsoleLogger,
    version = 'v1'
) {
    if( !Array.isArray( docs )) {
        throw new Error(`info-of-db.logging: 'docs' must be an Array.`);
    }

    if( version == 'v2' ) {
        if( docs.length ) {
            docs.forEach( (el) => logger.info( el ));
        }
        else {
            logger.info(`DB has no collections.`);
        }
    }
    else {
        /** version 1 */
        logger.info('\n',
            formatWithOptions( { colors: true }, '%O', docs )
        );
    }
}
