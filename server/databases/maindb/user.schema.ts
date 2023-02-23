// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'mongoose'.
var mongoose = require( 'mongoose' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var crypto = require( 'crypto' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var jwt = require( 'jsonwebtoken' );



// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'userSchema... Remove this comment to see the full error message
var userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});



userSchema.methods.setPassword = function( password: any ) {


    // @ts-expect-error TS(2339): Property 'randomBytes' does not exist on type 'Cry... Remove this comment to see the full error message
    this.salt = crypto.randomBytes( 16 ).toString( 'hex' );

    // @ts-expect-error TS(2339): Property 'pbkdf2Sync' does not exist on type 'Cryp... Remove this comment to see the full error message
    this.hash = crypto.pbkdf2Sync(
        password, 
        this.salt, 
        1000, 64, 'sha512' 
    ).toString( 'hex' );
};



userSchema.methods.validPassword = function( password: any ) {


    // @ts-expect-error TS(2339): Property 'pbkdf2Sync' does not exist on type 'Cryp... Remove this comment to see the full error message
    var hash = crypto.pbkdf2Sync(
        password, 
        this.salt, 
        1000, 64, 'sha512'
    ).toString( 'hex' );

    return this.hash === hash;
};



userSchema.methods.generateJwt = function() {


    var expiry = new Date();
    expiry.setDate( expiry.getDate() + 7 );

    return jwt.sign(
        {
            _id:   this._id,
            email: this.email,
            name:  this.name,
            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
            exp:   parseInt( expiry.getTime() / 1000, 10 ),
        }, 
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.env.JWT_SECRET
    ); 
    // DO NOT KEEP YOUR SECRET IN THE CODE!
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = userSchema;

