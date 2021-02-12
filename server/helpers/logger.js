
const { isHeroku } = require( './serverconfig' );


module.exports = function (ticker = '') {

    const prefix = isHeroku
        ? ''
        : `[${(new Date()).toUTCString()}] `
    ;
    const suffix = ticker == ''
        ? ''
        : ' ' + ticker
    ;

    function log (type, ...args) { // Все аргументы = массив аргументов    

        console.log( 
            `${prefix}${type}${suffix}`,
            ...args // Распаковка массива в значения
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
