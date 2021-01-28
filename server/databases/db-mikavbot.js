
const connection = require( './create-conn' );

const { 
    dbNames,
    mongoURIs, 
} = require( '../helpers/serverconfig' );

const { dbmain } = dbNames;

let title = `main-db [${dbmain}]`;


//'mongodb://hp8710w:36667 || env.MONGO_DEV || hp8710w:27017
let uri = ( process.env.NODE_ENV === 'production' ) 
    ? ( process.env.MONGO_STANDALONE || mongoURIs.STANDALONE )
    : ( process.env.MONGO_DEV || mongoURIs.DEV )
;

const db = connection.createConn( `${uri}/${dbmain}`, title );    
      

// BRING IN YOUR SCHEMAS & MODELS


const userSchema = require( '../models/users' );
db.model( 'User', userSchema, 'users' ); 


module.exports = db;

