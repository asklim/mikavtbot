
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securetize... Remove this comment to see the full error message
const { securetizeToken, } = require( './securetize.js' );

/**
 * Выводит переменные окружения process.env.*,
 * но без npm_* переменых, которых очень много
 * secretKeys сокращаются и вместо сокращения вставляется '***'
**/
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
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
    const isSecretEnvVar = (varName: any) => secretKeys.includes( varName );

    const excludesArray = excludes.split(',').map( x => x.trim() ).filter(Boolean);

    function isExcludeEnvVar (envVar: any) {
        const isStarts = (element: any) => envVar.startsWith( element );
        return excludesArray.some( isStarts );
    }

    const envWithout = {};

    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    Object.keys( process.env ).
    forEach( (key) => {
        if( isSecretEnvVar( key )) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            envWithout[ key ] = securetizeToken( process.env[ key ] );
        }
        else if( !isExcludeEnvVar( key ) ) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            envWithout[ key ] = process.env[ key ];
        }
    });

    let result;
    if( isSorted ) {
        result = {};
        // @ts-expect-error TS(2550): Property 'entries' does not exist on type 'ObjectC... Remove this comment to see the full error message
        for( const [key, value] of Object.entries( envWithout ).sort() ) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            result[ key ] = value;
        }
    }

    return Promise.resolve( result || envWithout );
};
