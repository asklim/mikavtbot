const serverConfig = require( './serverconfig' );
const httpResponses = require( './http-responses' ); 
const consoleLogger = require( './logger' );
const { securetizeToken } = require( './securetizeToken' );

console.log( 'typeof serverConfig', typeof serverConfig );
console.log( 'typeof consoleLogger', typeof consoleLogger );

module.exports = {
    ... serverConfig,
    ... httpResponses,
    consoleLogger,
    securetizeToken,
};
