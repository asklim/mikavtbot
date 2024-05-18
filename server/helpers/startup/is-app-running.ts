import { default as axios, AxiosError } from 'axios';
import { IConsoleLogger } from '../interfaces';


export default async function isAppRunning (
    port: string | number,
    logger: IConsoleLogger
) {
    const path = `http://localhost:${port}/tbpi/health/app`;
    try {
        const response = await axios.get( path );
        logger?.debug('isAppRunning, path:', path );
        logger?.debug('isAppRunning is true, data:', response.data );
        return true;
    }
    catch (err) {
        // logger?.debug('axios err:', err );
        const { cause, response } = err as AxiosError;
        // at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1606:16)
        if ( cause == undefined ) {
            //No POSIX error => app is running
            logger?.debug('isAppRunning, path:', path );
            logger?.debug('isAppRunning is true, data:', response?.data );
            return true;
        }
        // ALL OK, app is NOT running
        // logger?.error('isAppRunning is false', err );
        return false;
    }
}
