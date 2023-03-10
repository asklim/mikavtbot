import { env as ENV } from 'node:process';
import { securifyToken } from '../securitize';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlainJSObject = { [key: string]: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlainJSObjectEntry = [string, any];
// type PJSO = PlainJSObject;
// type PJSOEntry = PlainJSObjectEntry;

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
export default async function getProcessEnvWithout(
    excludes = 'npm_',
    isSorted = true,
    secretKeys: string[] = defaultSecretKeys
)
: Promise<PlainJSObject>
{
    return transformPJSO( ENV, excludes, isSorted, secretKeys );
}


export function transformPJSO (
    obj: PlainJSObject,
    excludes: string,
    isSorted: boolean,
    secretKeys: string[]
)
: PlainJSObject
{
    const excludesArray = excludes.split(',').map( x => x.trim() ).filter(Boolean);
    function isForOutput (tuple: PlainJSObjectEntry) {
        const isStartsWith = (element: string) => tuple[0].startsWith( element );
        return !excludesArray.some( isStartsWith );
    }

    const isSecretKey = (tuple: PlainJSObjectEntry) => secretKeys.includes( tuple[0] );
    function makeSecured (tuple: PlainJSObjectEntry) {
        if( isSecretKey( tuple )) {
            tuple[1] = securifyToken( tuple[1] );
        }
        return tuple;
    }

    const tuples = convertToTuples( obj ).
        filter( isForOutput ).
        map( makeSecured )
    ;
    return convertToRecord( tuples, isSorted );
}


function convertToTuples (
    obj: PlainJSObject
)
: PlainJSObjectEntry[]
{
    const result = new Map();

    for( const key of Object.keys( obj )) {
        result.set( key, obj[key]?.toString() ?? 'undefined');
    }
    return Array.from( result );
}


function compareTuplesAscending(
    curr: PlainJSObjectEntry,
    next: PlainJSObjectEntry
): number {
    if( curr[0] < next[0] ) { return -1; }
    if( curr[0] > next[0] ) { return 1; }
    // a must be equal to b
    return 0;
}


function convertToRecord (
    tuples: PlainJSObjectEntry[],
    isSorted: boolean
)
: PlainJSObject
{
    if( isSorted ) {
        tuples.sort( compareTuplesAscending );
    }
    const result: PlainJSObject = {};
    for( const [key, value] of tuples ) {
        result[ key ] = value;
    }
    return result;
}
