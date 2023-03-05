import * as process from 'process';

import { securifyToken, } from './securitize';

const defaultSecretKeys = [
    'JWT_SECRET',
    'ATLAS_CREDENTIALS',
    'GOOGLE_MAP_API_KEY',
    'RSIS_GOOGLE_API_KEY',
    'NGROK_AUTH_TOKEN',
    'VIBER_CHAT_TOKEN',
    'AVANGARD_V_VIBER_CHAT_TOKEN',
    'MIKAVBOT_TOKEN',
    'MIKAHOMEBOT_TOKEN',
    'PATH',
    'LS_COLORS'
];

/**
 * Выводит переменные окружения process.env.*,
 * но без npm_* переменых, которых очень много
 * secretKeys сокращаются и вместо сокращения вставляется '***'
**/
export default function getProcessEnvWithout(
    excludes: string = 'npm_',
    isSorted: boolean = true,
    secretKeys: string[] = defaultSecretKeys
){
    const isSecretEnvVar = (varName: string) => secretKeys.includes( varName );

    const excludesArray = excludes.split(',').map( x => x.trim() ).filter(Boolean);

    function isExcludeEnvVar (envVar: string) {
        const isStarts = (element: string) => envVar.startsWith( element );
        return excludesArray.some( isStarts );
    }

    const envWithout: {[key: string]: string} = {};

    Object.keys( process.env ).
    forEach( (key) => {
        let token = <string> process.env[ key ];
        if( isSecretEnvVar( key )) {
            envWithout[ key ] = securifyToken( token );
        }
        else if( !isExcludeEnvVar( key ) ) {
            envWithout[ key ] = token;
        }
    });

    let result: {[key: string]: string} = {};
    if( isSorted ) {
        result = {};
        for( const [key, value] of Object.entries( envWithout ).sort() ) {
            result[ key ] = value;
        }
    }

    return Promise.resolve( result || envWithout );
};
