const { 
    consoleLogger,
} = require( '../helpers' );
const log = consoleLogger( 'DB:' );

/**
 * Выводит адрес/имя_db, массив имен моделей 
 * и количество документов в их коллекциях
 * ----
 * @param {} aDb - mongoose.connection to MongoDB
*/
module.exports = function( aDb ) {
 
    //console.log('dbinfo: Mongoose version %s', mongoose.version);

    const title = `${aDb.host}:${aDb.port}/${aDb.db.databaseName}`;

    let callFunctionArray = [];
    const models = aDb.modelNames(); //массив имен моделей

    models
    .forEach( modelName => {   
        let theModel = aDb.model( modelName );
        callFunctionArray.push( 
            theModel.countDocuments( {}, (err, count) => count )
        );  
    });

    Promise.all( 
        callFunctionArray 
    )
    .then( docsCounts => {  
        log.info( `${title}: `, models, docsCounts );
    })
    .catch( error => console.log( error.message ));

};  
