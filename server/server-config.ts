/* */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dbNames'.
const dbNames = {
    dbmain : 'mikavbot',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mongoURIs'... Remove this comment to see the full error message
const mongoURIs = {
    DEV : "mongodb://192.168.0.240:27017",
    STANDALONE : "mongodb://192.168.0.240:36667",
    CLOUDDB_TEMPLATE : "mongodb://%s@rsis-shard-00-00-jjwdj.mongodb.net:27017,rsis-shard-00-01-jjwdj.mongodb.net:27017,rsis-shard-00-02-jjwdj.mongodb.net:27017/%s?ssl=true&replicaSet=rsis-shard-0&authSource=admin&retryWrites=true",
};

const RSIS_API_SERVER_LOCAL = "http://192.168.0.240:3067";


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {

    dbNames,
    mongoURIs,
    RSIS_API_SERVER_LOCAL,
};
