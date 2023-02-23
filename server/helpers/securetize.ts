
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securetize... Remove this comment to see the full error message
function securetizeToken(this: any, token: any, ahead=12, behind=3) {
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


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'securefy'.
function securefy (obj: any) {

    if( !Object.prototype.hasOwnProperty.call( obj, 'token' )) {
        return obj;
    }
    const clone = Object.assign( {}, obj );
    clone.token = securetizeToken( clone.token );
    return clone;
}


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    securetizeToken,
    securefy,
};
