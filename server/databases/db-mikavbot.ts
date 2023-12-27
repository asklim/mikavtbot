
import { default as createMongooseConnToDB } from './create-conn';

import {
    dbNames,
    mongoURIs,
} from '../server-config';

const { dbmain } = dbNames;

const title = `main-db [${dbmain}]`;


//'mongodb://hp8710w:36667 | env.MONGO_DEV | hp8710w:27017
const devDB = process.env.MONGO_DEV ?? mongoURIs.DEV;
const prodDB = process.env.MONGO_STANDALONE ?? mongoURIs.STANDALONE;

// NODE_ENV может быть undefined в продакшене для выполнения debug()
const { NODE_ENV } = process.env;
const isProdMode = NODE_ENV == undefined || NODE_ENV == 'production';

const uri = isProdMode ? prodDB : devDB;

const db = createMongooseConnToDB(`${uri}/${dbmain}`, title );


// BRING IN YOUR SCHEMAS & MODELS


import { default as userSchema } from './maindb/user.schema';
db.model('User', userSchema, 'users');


export default db;
