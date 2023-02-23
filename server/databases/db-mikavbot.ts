
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createConnectionTo = require( './create-conn' );

const {
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'dbNames'.
    dbNames,
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mongoURIs'... Remove this comment to see the full error message
    mongoURIs,
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( '../server-config' );

const { dbmain } = dbNames;

let title = `main-db [${dbmain}]`;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NODE_ENV'.
const { NODE_ENV } = process.env;

//'mongodb://hp8710w:36667 || env.MONGO_DEV || hp8710w:27017
// NODE_ENV может быть undefined в продакшене для выполнения debug()
let uri = ( NODE_ENV == undefined || NODE_ENV == 'production' )
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    ? ( process.env.MONGO_STANDALONE || mongoURIs.STANDALONE )
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    : ( process.env.MONGO_DEV || mongoURIs.DEV )
;

const db = createConnectionTo( `${uri}/${dbmain}`, title );


// BRING IN YOUR SCHEMAS & MODELS


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userSchema... Remove this comment to see the full error message
const userSchema = require( './maindb/user.schema' );
db.model( 'User', userSchema, 'users' );


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = db;

