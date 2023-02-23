
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const isHeroku = process.env.DYNO && (process.env.PWD === '/app');
// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const isSystemdService = (process.stdout.isTTY == undefined);

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function (ticker = '') {

    // Замыкаем suffix, но не prefix, иначе
    // будет одно и то же время на момент вызова create::logger
    const suffix = ticker == ''
        ? ''
        : ' ' + ticker
    ;

    function log (type: any, ...args: any[]) { // Все аргументы = массив аргументов

        const prefix = isHeroku || isSystemdService
            ? ''
            : `[${(new Date()).toUTCString()}] `
        ;
        console.log(
            `${prefix}${type}${suffix}`,
            ...args
            // Распаковка массива в значения
        );  // После `suffix` есть пробел. `,` вставляет пробел.
    }

    const info = (...args: any[]) => log( 'I:', ...args );

    const warn = (...args: any[]) => log( 'W:', ...args );

    const error = (...args: any[]) => log( 'E:', ...args );

    return ({
        info,
        warn,
        error,
    });
};
