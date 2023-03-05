export {
    securifyToken,
    securifyObjByList,
};

function securifyToken(
    token: string | undefined,
    ahead: number = 12,
    behind: number = 3
): string {
    try {
        if( !token ) {
            throw new Error('Invalid token');
        }
        const lenToken = token.length;

        if( lenToken > ahead+behind ) {
            return (
                token.slice( 0, ahead )
                + '***'
                + token.substring( lenToken-behind )
            );
        }
        return securifyToken( token, ahead-1, behind-1 );
    }
    catch (e) {
        return '';
    }
}


function securifyObjByList (
    obj: any,
    propList: string[] = ['token']
): any {

    const clone = Object.assign( {}, obj );

    function checkProperty (prop: string) {
        if( Object.prototype.hasOwnProperty.call( obj, prop )) {
            clone[prop] = securifyToken( clone[prop] );
        }
    }
    propList.map( checkProperty );
    return clone;
}
