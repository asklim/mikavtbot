// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'settings' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require( 'fs' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'path'.
const path = require( 'path' );
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const yaml = require( 'yaml' );


// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = { getSettings };

/**
 * Получаем настройки или, если их нет, то создаём файл с дефолтными
 * @param {string} yamlSettingsPathFName - имя файла настроек (.yaml)
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'getSetting... Remove this comment to see the full error message
async function getSettings (yamlSettingsPathFName: any){
    

    const configPFName = path.resolve( yamlSettingsPathFName );
    
    if( fs.existsSync( configPFName )) {

        const file = fs.readFileSync( configPFName, 'utf8' );        
        return await yaml.parse( file );
    }

    //Создаём файл и пишем дефолтные настройки
    const config = {
        multiplicator: 1,
        width: 1000,
        height: 1200,
        maxTextWidth: 900,
        jpegQuality: 60,
        marginTopMultiplicator: 2.5,
        font: {
            name: 'Segoe Print',
            style: 'bold',
            lineHeightMultiplicator: 1.5,
            size: 100,
            fillStyle: 'rgba(255, 255, 255,0.9)',
            textBaseline: 'middle',
            textAlign: 'center',
            shadow: {
                offsetX: 1, 
                offsetY: 1, 
                color: 'rgba(0, 0, 0, 0.5)', 
                blur: 8,
            },
            stroke: {
                style: 'rgba(15, 15, 15, 0.9)',
                lineWidth: 5,
            },
            glow: {
                offsetX: 1,
                offsetY: 1,
                color: 'rgba(255, 255, 255, 1)'
            }
        }
    };

    const doc = new yaml.Document();
    doc.version = true;
    doc.commentBefore = [
        '#################################################',
        ' Конфигурация для создания картинок.',
        ' Если что-то пошло не так, то удали этот файл и он пересоздастся ',
        ' с настройками по умолчанию.',
        ' multiplicator - множитель для увеличения картинки в самом начале,',
        '                 а потом уменьшения. Нужен, чтобы делать сглаживание.',
        '                 При увеличении - увеличивается время генерации',
        ' width - ширина картинки',
        ' height - высота картинки',
        ' maxTextWidth - максимальная ширина текста',
        ' marginTopMultiplicator - множитель для отступа сверху. Считает отступ сбоку',
        '                          ((width - maxTextWidth) / 2) и умножает его на эту цифру',
        ' font - настройки текста:',
        '   name - название шрифта',
        '   style - стиль шрифта(bold, italic или пусто).',
        '           Шрифт должен уметь поддерживать этот стиль.',
        '',
        '   lineHeightMultiplicator - множитель для высоты строки текста.',
        '                             На эту цифру умножается размер шрифта.',
        '   size - начальный размер в пикселях,',
        '          отталкиваясь от этого значения идёт изменение размера',
        '   shadow - тень под текстом',
        '   strokeStyle, lineWidth - обводка текста',
        '   glow - свечение под текстом',
    ].join( '\n' );
    doc.contents = config;

    fs.writeFile( configPFName, String( doc ),
        // eslint-disable-next-line no-unused-vars
        (err: any, written: any, _string: any) => {
            debug( `Осталось записать ${written} байт из ${_string && _string.length}` );
            if( err ) {
                console.log( `Ошибка записи в файл настроек ${configPFName}` );
            }
        }
    );

    return config;
}
