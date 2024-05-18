
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { env } from '<srv>/helpers/';

/**
 * Выводит информацию о сервере и
 * его окружении в консоль
 * ---
 * @param {string} outputMode - 'full' | 'addr' | ''
 * @param {string} appVersion
 * @param {http.Server} httpServer
 */
export default function showServerAppInfo (
    outputMode: string,
    appVersion: string,
    httpServer: http.Server
) {
    //if( env.SHOW_STARTUP_INFO == 'NO') { return; }

    const outputs: {
        [key: string]: () => void
    } = {
        full: () => console.log('Express server =', httpServer, '\n'),
        addr: () => {
            console.log('\napp version', appVersion.cyan );
            const mode = env.NODE_ENV ?? 'undefined';
            console.log('NODE Environment is', mode.cyan );
            console.log( getAddressInfo( httpServer ), '\n');
        }
    };
    const modeFn = outputs[ outputMode.toLowerCase() ];
    const defaultFn = () => console.log('\n');

    ( modeFn ?? defaultFn )();
    //(outputs[ outputMode.toLowerCase() ] ?? outputs['default'])();
}


function getAddressInfo (
    server: http.Server
) {
    const serverAddress = server.address();
    const {
        address,
        family,
        port
    } = <AddressInfo> serverAddress;

    const bind = typeof serverAddress == 'string' ?
        'pipe ' + serverAddress
        : 'port ' + port;

    return 'Express server = "' + address.cyan
            + '" Family= "' + family.cyan
            + '" listening on ' + bind.cyan;
}
