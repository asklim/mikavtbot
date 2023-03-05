import log from 'loglevel';

const isHeroku = process.env.DYNO && (process.env.PWD === '/app');
const isSystemdService = (process.stdout.isTTY == undefined);

const YELLOW_DARK = '\u001B[0;33;40m'; // dark-yellow
const YELLOW_BRIGHT = '\u001B[1;33;40m'; // bright-yellow
const ESCAPE_END = '\u001B[0m';

const DEBUG_SIGN_COLOR = YELLOW_BRIGHT;
const DEBUG_MESSAGE_COLOR = YELLOW_DARK;


export interface IConsoleLogger {
    trace: log.LoggingMethod; // 0
    debug: log.LoggingMethod; // 1
    info: log.LoggingMethod;  // 2
    warn: log.LoggingMethod;  // 3
    error: log.LoggingMethod; // 4
}

export class Logger implements IConsoleLogger {

    static setLevel (
        isProduction: boolean
    ): void {
        log.setLevel( isProduction ?
            log.levels.DEBUG
            : log.levels.TRACE
        );
    }

    private _ticker: string;

    constructor (
        ticker: string = ''
    ) {
        this._ticker = ticker == '' ?
            ''
            : ' ' + ticker
        ;
    }
    // Замыкаем _ticker, но не _date, иначе
    // будет одно и то же время на момент вызова logger.<fn>()


    private logPrefix (level: string) {

        const _date = isHeroku || isSystemdService
            ? ''
            : `[${(new Date()).toUTCString()}] `
        ;
        return `${_date}${level}${this._ticker}`;
    }


    private debugPrefix (level: string) {

        const _date = isHeroku || isSystemdService ? ''
            : `[${(new Date()).toISOString()}]`
        ;
        return `${DEBUG_SIGN_COLOR}${level}${ESCAPE_END} ${_date}`+
               `${DEBUG_MESSAGE_COLOR}${this._ticker}${ESCAPE_END}`;
    }


    public debug = (...args: any[]) => log.debug(
        this.debugPrefix('DEBUG')+DEBUG_MESSAGE_COLOR,
        ...args,
        ESCAPE_END
    );

    public info = (...args: any[]) => log.info( this.logPrefix('INF'), ...args );

    public warn = (...args: any[]) => log.warn( this.logPrefix('WARN'), ...args );

    public error = (...args: any[]) => log.error( this.logPrefix('ERROR'), ...args );

    public trace = (...args: any[]) => log.trace( this.debugPrefix('TRACE'), ...args );

};