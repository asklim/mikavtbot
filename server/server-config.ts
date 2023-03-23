
const dbNames = {
    dbmain : 'mikavbot',
};
const ATLAS0 = 'rsis-shard-00-00-jjwdj.mongodb.net:27017'
    , ATLAS1 = 'rsis-shard-00-01-jjwdj.mongodb.net:27017'
    , ATLAS2 = 'rsis-shard-00-02-jjwdj.mongodb.net:27017'
    , PARAMS = 'ssl=true&replicaSet=rsis-shard-0&authSource=admin&retryWrites=true'
    , LOCAL_SERVER = 'hp8710w.nu69b.mika'
    //DEV : "mongodb://192.168.0.240:27017",
;
const mongoURIs = {
    DEV : `mongodb://${LOCAL_SERVER}:27017`,
    STANDALONE : `mongodb://${LOCAL_SERVER}:36667`,
    CLOUDDB_TEMPLATE : `mongodb://%s@${ATLAS0},${ATLAS1},${ATLAS2}/%s?${PARAMS}`
};

const RSIS_API_SERVER_LOCAL = `http://${LOCAL_SERVER}:3067`;

export {
    dbNames,
    mongoURIs,
    RSIS_API_SERVER_LOCAL,
};
