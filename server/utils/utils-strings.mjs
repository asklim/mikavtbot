
export function trimSpacesCrLf (obj) {
    const WHITESPACE = "\x20";
    const trimAll = (str) => str.
        replace('\n', WHITESPACE).
        replace('\t', WHITESPACE).
        split( WHITESPACE ).
        filter( Boolean ).
        join( WHITESPACE )
    ;
    for ( const k in obj ) {
        const value = obj[ k ];
        if ( typeof value === 'string') {
            obj[ k ] = trimAll( value );
        }
    }
}
