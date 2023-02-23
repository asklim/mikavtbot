
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const httpResponses = require( './http-responses.js' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'consoleLog... Remove this comment to see the full error message
const consoleLogger = require( './logger.js' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const securetize = require( './securetize.js' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getProcess... Remove this comment to see the full error message
const getProcessEnvWithout = require( './get-process-env-without.js' );

//const uploadPhoto = require( '../helpers/upload-photo.js' );

//console.log( 'typeof consoleLogger', typeof consoleLogger );

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'icwd'.
const icwd = require( 'fs' ).realpathSync( process.cwd() );


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    icwd,
    consoleLogger,
    getProcessEnvWithout,
    ... httpResponses,
    ... securetize,
    //... uploadPhoto,
};
