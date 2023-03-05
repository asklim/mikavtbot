
// interface DBs {
//     botmain: any
// };

// const dbs: DBs = {
//     botmain: undefined
// };

const dbs: any = {};

/**
 * @name getDB
 * @memberof /api/models
 * @summary Возвращает указанную базу данных
 * @param {String} dbType The database type
 * @return {Mongoose.Connection} The connection to database
*/
function getDB(
    dbType: string | undefined = 'main'
) {
    return dbs.botmain;
}

async function createDatabasesConnections() {

    if( !dbs.botmain ) {
        dbs.botmain = await import('./db-mikavbot');
    }
}


// To be called when process is restarted Nodemon or terminated

const databasesShutdown = (
    msg: string,
    next: any
) => {
    const allDbsClosingPromises = Object.keys( dbs ).map(
        (dbKey) => /*dbs[ dbKey ].closeConn()*/ dbKey
    );


    Promise.all( allDbsClosingPromises )
    .then( dbsNames => {
        console.log( 'dbs closed: ', dbsNames );
        console.log( 'Mongoose disconnected through ' + msg );
        next();
    })
    .catch( error => console.log( error.message ));
};

export {
    getDB,
    createDatabasesConnections,
    databasesShutdown
};
