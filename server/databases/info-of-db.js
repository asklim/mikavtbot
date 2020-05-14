
module.exports.log = function( aDb ) {


    /**
     * @name log
     * aDb - mongoose.connection to MongoDB
    */
 
    //console.log('dbinfo: Mongoose version %s', mongoose.version);

    var title = `dbinfo: ${aDb.host}:${aDb.port}/${aDb.db.databaseName}`;
    
    /*  console.log(`${title}: collection's count = %d`, 
                    Object.keys(iDb.collections).length);
    console.log(`${title}: model's count = ${iDb.modelNames().length}`);  
    console.log(`${title}: `, iDb.modelNames());
    */

    var callArr = [];
    let models = aDb.modelNames(); //массив имен моделей

    models
    .forEach( modelName => {   
        let theModel = aDb.model( modelName );
        callArr.push( 
            theModel.countDocuments( {}, (err, count) => count )
        );  
    });

    Promise.all( callArr )
    .then( docsCounts => {  
            console.log( `${title}: `, models, docsCounts );
    })
    .catch( error => console.log( error.message ));

};  
