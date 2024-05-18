
/**
 * Удаляет ОписаниеДекларацииСоответствия из всех
 * свойств объекта ***obj***. Применяется для очистки
 * наименований товара от лишней информации.
 * @param {*} obj
 */
export function deleteDeclarationDescription (obj) {

    function deleteDD (str) {
        const ddStarts = [
            "ДЕКЛАРАЦИЯ",
            "ДС №",  //'С -[ru]
            "ДC №",  //'C -[en]
            "TC RU", //'TC -[en+en]
            "TС RU", //'TС -[en+ru]
            "ТC RU", //'TC -[ru+en]
            "ТС RU"  //'TС -[ru+ru]
        ];
        const upper = str.toUpperCase();
        let idx = 0;
        for ( const start of ddStarts ) {
            idx = upper.indexOf( start );
            if ( idx !== -1 ) { // !(not found)
                return str.substring( 0, idx );
            }
        }
        return str;
    }

    for ( const k in obj ) {
        const value = obj[ k ];
        if ( typeof value === 'string') {
            obj[ k ] = deleteDD( value );
        }
    }
}
