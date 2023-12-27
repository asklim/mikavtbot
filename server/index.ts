#!/usr/bin/env node

import {
    env,
    botVersion,
    Logger
} from './helpers/';

import {
    isAppRunning,
    showStartSystemInfo
} from './helpers/startup/';

Logger.setLevel( env.isProduction );

const initLog = new Logger('[prepare]:');

(async () => {
    if( await isAppRunning( env.PORT, initLog )) {
        initLog.warn('App has already been launched.');
        process.exit( 1 );
    }
    await showStartSystemInfo( botVersion );
    const { startServer } = await import('./1-http-base');
    startServer();

    initLog.info('=======================');
    initLog.info('End of prepare section.');
    initLog.info('=======================');
})();
