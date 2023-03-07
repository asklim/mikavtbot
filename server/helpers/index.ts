import {
    realpathSync,
    readFileSync,
} from 'node:fs';

export const icwd = realpathSync( process.cwd() );

// import { version } from '<root>/package.json';
// This import ADD 'package.json' to dist/
const packageJson = JSON.parse( readFileSync(`${icwd}/package.json`, 'utf-8'))
const { version } = packageJson;

export { version as botVersion };
export { default as env } from './env';
export { default as debugFactory } from 'debug';
export { default as httpResponseCodes } from './http-response-codes';
export * from './logger-class';
export * from './http-responses';
export * from './securitize';

//export { default as consoleLogger } from './logger';
//export { default as getProcessEnvWithout } from './startup/get-process-env-without';
