
const { securetizeToken, } = require( './securetize.js' );

/**
 * Выводит переменные окружения process.env.*,
 * но без npm_* переменых, которых очень много
 * secretKeys сокращаются и вместо сокращения вставляется '***'
**/
module.exports = function getProcessEnvWithout(
    excludes='npm_',
    isSorted = true,
    secretKeys = [
        'JWT_SECRET', 'ATLAS_CREDENTIALS',
        'GOOGLE_MAP_API_KEY', 'RSIS_GOOGLE_API_KEY',
        'NGROK_AUTH_TOKEN', 'VIBER_CHAT_TOKEN',
        'AVANGARD_V_VIBER_CHAT_TOKEN',
        'MIKAVBOT_TOKEN', 'MIKAHOMEBOT_TOKEN',
        'PATH', 'LS_COLORS'
    ]
){
    const isSecretEnvVar = (varName) => secretKeys.includes( varName );

    const excludesArray = excludes.split(',').map( x => x.trim() ).filter(Boolean);

    function isExcludeEnvVar (envVar) {
        const isStarts = (element) => envVar.startsWith( element );
        return excludesArray.some( isStarts );
    }

    const envWithout = {};

    Object.keys( process.env ).
    forEach( (key) => {
        if( isSecretEnvVar( key )) {
            envWithout[ key ] = securetizeToken( process.env[ key ] );
        }
        else if( !isExcludeEnvVar( key ) ) {
            envWithout[ key ] = process.env[ key ];
        }
    });

    let result;
    if( isSorted ) {
        result = {};
        for( const [key, value] of Object.entries( envWithout ).sort() ) {
            result[ key ] = value;
        }
    }

    return Promise.resolve( result || envWithout );
};
