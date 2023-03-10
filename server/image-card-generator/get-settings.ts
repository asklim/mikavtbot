// import { default as debugFactory } from 'debug';
// const debug = debugFactory('settings');

import yaml from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
import {
    CanvasTextAlign,
    CanvasTextBaseline
} from 'canvas';


type TShadow = {
    offsetX: number;
    offsetY: number;
    color: string;
    blur: number;
};
type TStroke = {
    style: string;
    lineWidth: number;
};
type TGlow ={
    offsetX: number;
    offsetY: number;
    color: string;
};

export type TFont = {
    name: string;
    style: string;
    lineHeightMultiplicator: number;
    size: number;
    fillStyle: string;
    textBaseline: CanvasTextBaseline;
    textAlign: CanvasTextAlign;
    shadow: TShadow;
    stroke: TStroke;
    glow: TGlow;
};

export type GeneratorOptions = {
    multiplicator: number;
    width: number;
    height: number;
    maxTextWidth: number;
    jpegQuality: number;
    marginTopMultiplicator: number;
    outputFontSize: number;
    font: TFont;
};


const DEFAULT_CONFIG: GeneratorOptions = {
    multiplicator: 1,
    width: 1000,
    height: 1200,
    maxTextWidth: 900,
    jpegQuality: 60,
    marginTopMultiplicator: 2.5,
    outputFontSize: 100,
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


export default getSettings;

/**
 * Получаем настройки или, если их нет, то создаём файл с дефолтными
 * @param {string} yamlSettingsPathFName - имя файла настроек (.yaml)
 */
async function getSettings (
    yamlSettingsPathFName: string
)
: Promise<GeneratorOptions>
{
    const configPFName = path.resolve( yamlSettingsPathFName );

    if( fs.existsSync( configPFName )) {
        try {
            const file = fs.readFileSync( configPFName, 'utf8' );
            const config = await yaml.parse( file );
            if( !config ) {
                throw Error(`invalid ${yamlSettingsPathFName}.`);
            }
            return config;
        }
        catch {
            return createDefaultSettings( configPFName );
        }
    }

    return createDefaultSettings( configPFName );
}


/*
 * Создаём файл и пишем дефолтные настройки
*/
function createDefaultSettings (
    yamlPFName: string
) {
    const doc = new yaml.Document( DEFAULT_CONFIG );
    //doc.version = true;
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
    // doc.contents = config;

    fs.writeFile( yamlPFName, String( doc ),
        (err) => {
            if( err ) {
                console.log(`Ошибка записи в файл настроек ${yamlPFName}`);
            }
        }
    );

    return DEFAULT_CONFIG;
}
