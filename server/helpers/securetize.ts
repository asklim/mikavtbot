
function securetizeToken (token, ahead=12, behind=3) {
    try {
        const lenToken = token.length;

        if( lenToken > ahead+behind ) {
            return (
                token.slice( 0, ahead )
                + '***'
                + token.substring( lenToken-behind )
            );
        }
        this.securetizeToken( token, ahead-1, behind-1 );

    }
    catch (e) {
        return '';
    }
}


function securefy (obj) {

    if( !Object.prototype.hasOwnProperty.call( obj, 'token' )) {
        return obj;
    }
    const clone = Object.assign( {}, obj );
    clone.token = securetizeToken( clone.token );
    return clone;
}


module.exports = {
    securetizeToken,
    securefy,
};
