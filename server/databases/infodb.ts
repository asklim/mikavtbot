// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( '-dbs:info' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'formatWith... Remove this comment to see the full error message
const { formatWithOptions } = require( 'util' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
const { consoleLogger, } = require( '../helpers' );

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports.log = async function (mongooseConnection: any) {

    //debug( `Mongoose version ${mongooseConnection.base.version}` );

    const { host, port, db, id } = mongooseConnection;
    debug( `Mongoose connection id: ${id}` );

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
        console.log( 'infodb.js - catch block');
        log.error( error );
    }

};
