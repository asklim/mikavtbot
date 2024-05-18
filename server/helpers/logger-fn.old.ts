import log from 'loglevel';

const isHeroku = process.env.DYNO && (process.env.PWD === '/app');
const isSystemdService = (process.stdout.isTTY == undefined);

const YELLOW_DARK = '\u001B[0;33;40m'; // dark-yellow
const YELLOW_BRIGHT = '\u001B[1;33;40m'; // bright-yellow
const ESCAPE_END = '\u001B[0m';

const DEBUG_SIGN_COLOR = YELLOW_BRIGHT;
const DEBUG_MESSAGE_COLOR = YELLOW_DARK;


export default function createLogger (
    ticker = ''
) {
    // Замыкаем _ticker, но не _date, иначе
    // будет одно и то же время на момент вызова logger.<fn>()
    const _ticker = ticker == ''
        ? ''
        : ' ' + ticker
    ;

    function logPrefix (level: string) {

        const _date = isHeroku || isSystemdService
            ? ''
            : `[${(new Date()).toUTCString()}] `
        ;
        return `${_date}${level}${_ticker}`;
    }


    function debugPrefix (level: string) {

        const _date = isHeroku || isSystemdService ? ''
            : `[${(new Date()).toISOString()}]`
        ;
        return `${DEBUG_SIGN_COLOR}${level}${ESCAPE_END} ${_date}`+
               `${DEBUG_MESSAGE_COLOR}${_ticker}${ESCAPE_END}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debug = (...args: any[]) => log.debug(
        debugPrefix('DEBUG')+DEBUG_MESSAGE_COLOR,
        ...args,
        ESCAPE_END
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const info = (...args: any[]) => log.info( logPrefix('INF'), ...args );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const warn = (...args: any[]) => log.warn( logPrefix('WARN'), ...args );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = (...args: any[]) => log.error( logPrefix('ERROR'), ...args );

    return ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trace: (...args: any[]) => log.trace( debugPrefix('TRACE'), ...args ),
        debug,
        info,
        warn,
        error,
    });
}
