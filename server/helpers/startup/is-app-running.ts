import { default as axios } from 'axios';
import { IConsoleLogger } from '../interfaces';


export default async function isAppRunning (
    port: string,
    logger: IConsoleLogger
) {
    try {
        const path = `http://localhost:${port}/tbpi/health/app`;
        const response = await axios.get( path );
        logger?.debug('isAppRunning, path:', path );
        logger?.debug('isAppRunning is true, data:', response.data );
        return true;
    }
    catch (err) {
        // ALL OK, app is NOT running
        // logger?.error('isAppRunning is false', err );
        return false;
    }
}
