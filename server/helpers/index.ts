
const httpResponses = require( './http-responses.js' );
const consoleLogger = require( './logger.js' );
const securetize = require( './securetize.js' );
const getProcessEnvWithout = require( './get-process-env-without.js' );

//const uploadPhoto = require( '../helpers/upload-photo.js' );

//console.log( 'typeof consoleLogger', typeof consoleLogger );

const icwd = require( 'fs' ).realpathSync( process.cwd() );


module.exports = {
    icwd,
    consoleLogger,
    getProcessEnvWithout,
    ... httpResponses,
    ... securetize,
    //... uploadPhoto,
};
