import { createHash } from 'node:crypto';
import path from 'node:path';

import { trimSpacesCrLf } from '../../utils/utils-strings.mjs';
import { deleteDeclarationDescription } from '../../utils/utils-prices.mjs';

const FN = path.basename( __filename );
// const d = console.log;

class Pricelist {

    #meta;
    #fields;
    #rawList;
    #pricelist;

    constructor (
        rawList,
        opts
    ) {
        this.#meta = opts.meta ?? {};
        this.#fields = opts.fields ?? {};
        if ( rawList && Array.isArray( rawList ) ) {
            this.#rawList = rawList;
            this.#pricelist = this.fromArrayOfObjects( this.#rawList );
        }
        else {
            throw new Error('Source rawList must be valid array.');
        }
    }

    toJson () {
        return this.#pricelist;
    }

    toString () {
        return JSON.stringify( this.#pricelist, undefined, 4 );
    }


    fromArrayOfObjects (
        aoo
    ) {
        const rows = [];
        for ( const row of aoo ) {
            const newrow = this.toPricelistRow( row, this.#fields );
            rows.push( newrow );
        }
        return ({
            meta: { ...this.#meta },
            rows: rows,
        });
    }

    toPricelistRow (
        row,    //Object
        fields  //Object
    ) {
        const obj = this.changeFieldsNames( row, fields );
        deleteDeclarationDescription( obj );
        trimSpacesCrLf( obj );
        this.addTitleHash( obj );
        return obj;
    }

    changeFieldsNames (
        row,
        fieldsSynonyms
    ) {
        const obj = {};
        for (
            const k of Object.keys( row ).sort()
        ) {
            const value = row[ k ];
            if ( k in fieldsSynonyms ) {
                const key = fieldsSynonyms[ k ];
                obj[ key ] = value;
            }
            else {
                obj[ k ] = value;
            }
        }
        return obj;
    }


    addTitleHash (obj) {
        try {
            const { title } = obj;
            if ( !title ) { return; }
            const hash = createHash('md5').update( title );
            obj.titleHash = hash.digest('hex');
        }
        catch (err) {
            console.error(
                `[${FN}]{addTitleHash} Error Handler:\n`, err, 'parameter obj:', obj
            );
        }
    }
}

export default Pricelist;
