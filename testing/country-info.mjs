import list from 'world-countries';
import process from 'node:process';

console.log('argv: ', process.argv );
const argv = process.argv.slice(2);
const [ field, value ] = argv;

const country = list.filter( x=> x?.[field] == value );

console.log('country info', country );
