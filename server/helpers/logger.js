
const isHeroku = process.env.DYNO && (process.env.PWD === '/app');
const isSystemdService = (process.stdout.isTTY == undefined);

module.exports = function (ticker = '') {

    // Замыкаем suffix, но не prefix, иначе
    // будет одно и то же время на момент вызова create::logger
    const suffix = ticker == ''
        ? ''
        : ' ' + ticker
    ;

    function log (type, ...args) { // Все аргументы = массив аргументов

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

    const info = (...args) => log( 'I:', ...args );

    const warn = (...args) => log( 'W:', ...args );

    const error = (...args) => log( 'E:', ...args );

    return ({
        info,
        warn,
        error,
    });
};
