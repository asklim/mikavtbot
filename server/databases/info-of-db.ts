const { formatWithOptions } = require( 'util' );
const {
    consoleLogger,
} = require( '../helpers' );
const log = consoleLogger( 'DB:' );

/**
 * Выводит адрес/имя_db, массив имен моделей
 * и количество документов в их коллекциях
*/
module.exports = async function (mongooseConnection) {

    //debug( `Mongoose version ${mongooseConnection.base.version}` );

    const { host, port, db, id } = mongooseConnection;
    //debug( `Mongoose connection id: ${id}` );

    const title = `dbinfo: ${host}:${port}/${db.databaseName}`;
    const log = consoleLogger( `${title}:` );

    try {
        const models = mongooseConnection.modelNames();
        //массив имен моделей (Строки)
        //debug( `${title}: model's count = ${models.length}` );
        //debug( `${title}:`, models );

        const infoDocs = [];
        for( let modelName of models ) {
            let theModel = mongooseConnection.model( modelName );
            let count = await theModel.countDocuments({});
            infoDocs.push([ modelName, count ]);
        }

        console.log( `${title}:\n`,
            formatWithOptions( { colors: true }, '%O', infoDocs )
        );
    }
    catch (error) {
        console.log( 'info-of-db.js - catch block');
        log.error( error );
    }

};
