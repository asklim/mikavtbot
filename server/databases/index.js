
var dbs = {};


function getDB( /*dbType*/ ) {
  
    
    /**
     * @name getDB
     * @memberof /api/models 
     * @summary Возвращает указанную базу данных
     * @param {String} dbType The database type
     * @return {Mongoose.Connection} The connection to database
    */  

    return dbs.botmain; 
}


function createConns() {

    if( !dbs.botmain ) { dbs.botmain = require( './db-mikavbot' ); }
}


// To be called when process is restarted Nodemon or terminated
const databasesShutdown = ( msg, next ) => {

    const allDbsClosingPromises = Object.keys( dbs ).map( 
        dbKey => dbs[ dbKey ].closeConn() 
    );

    Promise.all( allDbsClosingPromises )
    .then( dbsNames => {
        console.log( 'dbs closed: ', dbsNames );
        console.log( 'Mongoose disconnected through ' + msg );
        next();  
    })
    .catch( error => console.log( error.message ));
};

module.exports = {
  getDB,
  createConns,
  databasesShutdown
};
