
const createConnectionTo = require( './create-conn' );

const {
    dbNames,
    mongoURIs,
} = require( '../server-config' );

const { dbmain } = dbNames;

let title = `main-db [${dbmain}]`;

const { NODE_ENV } = process.env;

//'mongodb://hp8710w:36667 || env.MONGO_DEV || hp8710w:27017
// NODE_ENV может быть undefined в продакшене для выполнения debug()
let uri = ( NODE_ENV == undefined || NODE_ENV == 'production' )
    ? ( process.env.MONGO_STANDALONE || mongoURIs.STANDALONE )
    : ( process.env.MONGO_DEV || mongoURIs.DEV )
;

const db = createConnectionTo( `${uri}/${dbmain}`, title );


// BRING IN YOUR SCHEMAS & MODELS


const userSchema = require( './maindb/user.schema' );
db.model( 'User', userSchema, 'users' );


module.exports = db;

