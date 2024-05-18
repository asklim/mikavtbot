import * as XLSX from 'xlsx';
import { resolve, } from 'node:path';
import { cwd } from 'node:process';

import Pricelist from './json-pricelist-parser.mjs';
import { commonFields } from './price-fields-matrix.mjs';

const _d = console.log;

/* load 'fs' for readFile and writeFile support */
import * as fs from 'node:fs';
XLSX.set_fs( fs );

// /* load 'stream' for stream support */
// import { Readable } from 'stream';
// XLSX.stream.set_readable(Readable);

const xlsxFN = '2023-12DEC-08-Форма-заказа.xlsx';
const outJsonFN = './2023-12DEC-08-output.json';

try {
    const workbook = XLSX.readFile( resolve( cwd(), xlsxFN ), {
        dense: true
    });
    outputWBookProps( workbook );

    const shName = workbook.SheetNames?.[0] ?? '';
    const sheet = workbook.Sheets[ shName ];
    outputSheetProps( sheet );

    const jsa = XLSX.utils.sheet_to_json( sheet );
    const opts = {
        meta: {},
        fields: {
            ...commonFields
        }
    };
    const priceList = new Pricelist( jsa, opts );
    const pl = priceList.toString();
    _d('typeof pl:', typeof pl );
    fs.writeFileSync( outJsonFN, pl );
}
catch (err) {
    console.trace( err );
}

function outputWBookProps (wb) {
    _d( wb.Props );
    const wsNames = wb.SheetNames;
    _d( wsNames ); // [ 'Sheet1' ]
    _d( wb.Workbook.Sheets ); // [ { Hidden: 0, name: 'Sheet1' } ]
}

function outputSheetProps (sheet) {
    const regEx = /^\w\d+/;
    _d('sheet props:\n', Object.keys( sheet ).
        filter( (k) => !regEx.test( k )).
        sort()
    );
    _d('!data:', sheet['!data']);
    _d( sheet['!cols'], 'x', sheet['!rows'], sheet.Props );
    // undefined x [ { hpt: 11.25, hpx: 11.25 }, { hpt: 2.25, hpx: 2.25 } ] undefined
}
