import env from './helpers/env';
import os from 'node:os';
import util from 'node:util';
import colors from 'colors';
import { default as axios, AxiosResponse } from 'axios';

import {
    icwd,
    botVersion,
    getProcessEnvWithout,
    Logger
} from './helpers';

Logger.setLevel( env.isProduction );

const initLog = new Logger('[prepare]:');

(async () => {
    if( await isAppInProcess( env.PORT )) {
        initLog.warn('App has already been launched.');
        process.exit( 1 );
    }
    await showStartSystemInfo( botVersion );
    await import('./http-base');
    initLog.info( 'End of prepare section.' );
})();


/******************************************************************/


async function showStartSystemInfo (
    appVersion: string
) {
    const {
        PWD, USER, NAME, NODE_ENV
    } = process.env;
    const node_env = NODE_ENV ?? 'undefined';
    const userInfo = util.format('%O', os.userInfo() );
    console.log('app version', appVersion.cyan );
    console.log('NODE Environment is', node_env.cyan );

    const envList = await getProcessEnvWithout('npm_, XDG, LESS');
    console.log( envList );

    console.log('stdout.isTTY is'.gray, `${process.stdout.isTTY}`.yellow );
    // isTTY == true - in terminal, undefined - in service journal
    console.log('package.json dir is'.gray, `${icwd}`.red ); // = '/app'
    console.log(`PWD (${__filename}) is ${PWD}`.gray );
    console.log('USER @ NAME'.red, 'is'.gray, `${USER} @ ${NAME}`.red );
    console.log(
        'platform is'.gray, `${os.platform()}`.cyan,
        ', hostname is'.gray, `${os.hostname()}`.cyan
    );
    console.log( colors.gray('User Info:'), userInfo.yellow );
    console.log( colors.gray('process pid:'), colors.cyan(''+process.pid ), '\n' );
}


async function isAppInProcess (
    port: string
) {
    try {
        let path = `http://localhost:${port}/tbpi/health/app`;
        let response = await axios.get( path );
        initLog.debug('isAppInProgress path:', path );
        initLog.debug('isAppInProgress is true, data:', response.data );
        //console.log( response );
        return true;
    }
    catch (err) {
        // ALL OK, app is NOT running
        //initLog.error('isAppInProgress is false', err );
        return false;
    }
}
