
import mongoose from 'mongoose';
import crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({

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



userSchema.methods.setPassword = function(
    password: string
) {
    this.salt = crypto.randomBytes( 16 ).toString('hex');

    this.hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000, 64, 'sha512'
    ).
    toString('hex');
};


userSchema.methods.validPassword = function(
    password: string
) {
    const hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000, 64, 'sha512'
    ).
    toString( 'hex' );

    return this.hash === hash;
};


userSchema.methods.generateJwt = function (
) {
    const expiry = new Date();
    expiry.setDate( expiry.getDate() + 7 );

    return jwt.sign(
        {
            _id:   this._id,
            email: this.email,
            name:  this.name,
            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
            exp:   parseInt( expiry.getTime() / 1000, 10 ),
        },
        <jwt.Secret> process.env.JWT_SECRET
    );
    // DO NOT KEEP YOUR SECRET IN THE CODE!
};


export default userSchema;

