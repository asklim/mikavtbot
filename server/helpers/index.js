
const httpResponses = require( './http-responses' );
const consoleLogger = require( './logger' );
const securetize = require( './securetize' );

//console.log( 'typeof consoleLogger', typeof consoleLogger );

const icwd = require( 'fs' ).realpathSync( process.cwd() );


module.exports = {
    icwd,
    consoleLogger,
    ... httpResponses,
    ... securetize,
};
