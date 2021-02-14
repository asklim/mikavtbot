
module.exports.securetizeToken = function (token, ahead=12, behind=3) { 
    try {
        const lenToken = token.length;
        
        if( lenToken > ahead+behind ) {
            return token.slice(0,ahead) + '***' 
            + token.substring( lenToken-behind );
        }
        this.securetizeToken( token, ahead-1, behind-1 );

    }
    catch (e) {
        return '';
    }
};
