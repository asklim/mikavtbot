import * as XLSX from 'xlsx';
import { resolve, } from 'node:path';
import { cwd } from 'node:process';

import Pricelist from './json-pricelist-parser.mjs';

const _d = console.log;

/* load 'fs' for readFile and writeFile support */
import * as fs from 'node:fs';
XLSX.set_fs( fs );

// /* load 'stream' for stream support */
// import { Readable } from 'stream';
// XLSX.stream.set_readable(Readable);

const xlsFN = '2023-1222_прайс.xls';
// const xlsxFN = 'Форма-заказа-12DEC-08.xlsx';
const outJsonFN = './output.json';

try {
    const workbook = XLSX.readFile( resolve( cwd(), xlsFN ), undefined );
    _d( workbook.Props );
    const wsNames = workbook.SheetNames;
    _d( wsNames ); // [ 'Sheet1' ]
    _d( workbook.Workbook.Sheets ); // [ { Hidden: 0, name: 'Sheet1' } ]

    const shName = wsNames?.[0] ?? '';
    const sheet = workbook.Sheets[ shName ];
    _d( sheet['!cols'], 'x', sheet['!rows'], sheet.Props );
    // undefined x [ { hpt: 11.25, hpx: 11.25 }, { hpt: 2.25, hpx: 2.25 } ] undefined

    const jsa = XLSX.utils.sheet_to_json( sheet );
    const opts = {
        meta: {},
        fields: {
            '__EMPTY': 'title',
            '__EMPTY_1': 'price',
            '__EMPTY_2': 'units',
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
