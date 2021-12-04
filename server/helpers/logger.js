let { PWD, DYNO } = process.env;
const isHeroku = DYNO && (PWD === '/app');


module.exports = function (ticker = '') {

    // Замыкаем suffix, но не prefix, иначе
    // будет одно и то же время на момент вызова create::logger
    const suffix = ticker == ''
        ? ''
        : ' ' + ticker
    ;

    function log (type, ...args) { // Все аргументы = массив аргументов

        const prefix = isHeroku
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
