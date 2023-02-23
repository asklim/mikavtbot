
const dbs = {};


/**
 * @name getDB
 * @memberof /api/models
 * @summary Возвращает указанную базу данных
 * @param {String} dbType The database type
 * @return {Mongoose.Connection} The connection to database
*/
function getDB( /*dbType*/ ) {
    // @ts-expect-error TS(2339): Property 'botmain' does not exist on type '{}'.
    return dbs.botmain;
}


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createData... Remove this comment to see the full error message
function createDatabasesConnections() {

    // @ts-expect-error TS(2339): Property 'botmain' does not exist on type '{}'.
    if( !dbs.botmain ) {
        // @ts-expect-error TS(2339): Property 'botmain' does not exist on type '{}'.
        dbs.botmain = require( './db-mikavbot' );
    }
}


// To be called when process is restarted Nodemon or terminated
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databasesS... Remove this comment to see the full error message
const databasesShutdown = ( msg: any, next: any ) => {

    const allDbsClosingPromises = Object.keys( dbs ).map(
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    getDB,
    createDatabasesConnections,
    databasesShutdown
};
