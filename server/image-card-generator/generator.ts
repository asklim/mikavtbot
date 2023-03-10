import { default as debugFactory } from 'debug';
const debug = debugFactory('main');
debug( process.env.NODE_ENV );

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

//const Jimp = require( 'jimp' );

import {
    chooseFontSize,
    createImagedCanvas,
    printTextOnCanvas,
    resizedImageToBuffer,
} from './image-creator';

import getSettings, { GeneratorOptions } from './get-settings';


class ImageGeneratorError extends Error {}


const MINIMAL_FONT_SIZE = 12;
const bgimagesDirName = './bg-images';
const outputDirName = './output';
const textsFName = './text.txt';


if( !fs.existsSync( bgimagesDirName )) {
    // @ts-expect-error TS(1108): A 'return' statement can only be used within a fun... Remove this comment to see the full error message
    return _errorAndExit(
        'В папке с скриптом создай папку ' + bgimagesDirName +
        ' и положи в неё картинки'
    );
}

if( !fs.existsSync( textsFName )) {
    // @ts-expect-error TS(1108): A 'return' statement can only be used within a fun... Remove this comment to see the full error message
    return _errorAndExit(
        'В папке с скриптом создай файл ' + textsFName +
        ' и на каждой его строке напиши тексты'
    );
}

if( !fs.existsSync( outputDirName )){

    fs.mkdirSync( outputDirName );
    console.log( 'Создана папка для хранения результатов:', outputDirName );
}

const imagesFNames = fs.readdirSync( path.resolve( bgimagesDirName )).sort();
const texts = fs.readFileSync( path.resolve( textsFName ), 'utf8' );
const textsArr = texts.split( /\r?\n/g ).filter( Boolean );

if( !imagesFNames.length ){
    // @ts-expect-error TS(1108): A 'return' statement can only be used within a fun... Remove this comment to see the full error message
    return _errorAndExit(
        'Папка ' + bgimagesDirName + ' пустая, положи в неё картинки'
    );
}
if( !textsArr.length ){
    // @ts-expect-error TS(1108): A 'return' statement can only be used within a fun... Remove this comment to see the full error message
    return _errorAndExit(
        'В файле ' + textsFName +
        ' нет текста, добавь по одному сообщению на строку'
    );
}

//Начальные настройки
const bgImageBuffers: {[key: string]: Buffer } = {};


//Запускаем обработку текстов в цикле
(async function () {
    try {

        const settings = await getSettings( './settings.yaml' );

        //if( imagesFNames ) { throw new Error( 'Global test error.' ); }

        const isOkResult = (
            item: PromiseSettledResult<string>
        ) => item.status == 'fulfilled';

        const allImagesResults = await preProcessingAllImages( imagesFNames, settings );

        const imagesOk = allImagesResults.filter( isOkResult );
        console.log(
            `Successed buffered background images: ${imagesOk.length}\n`
        );
        debug( allImagesResults, /*'\n', bgImageBuffers*/ );

        const allTextsResults = await processingAllTexts( textsArr, settings );

        //const textResultFilter = (item: any) => !!item.value;
        const textsOk = allTextsResults.filter( isOkResult );
        console.log(
            `Успешно наложено текстов на images: ${textsOk.length}`
        );
        debug( allTextsResults );

        console.log( textsOk.length == textsArr.length
            ? `Все строки текста (${textsArr.length}) обработаны. Cпасибо :)`
            : `Обработано только ${textsOk.length} из ${textsArr.length} строк текста.`
        );
    }
    catch (error) {
        console.log( 'Global Error Handler:\n', error );
    }
})();

/********************************************************************** */

/**
 * Читаем все файлы background картинок
 * форматируем их в подходящий размер и сохраняем их в cache
 * @param {[string]} fileNames
 * @param {{}} settings
 * {[{
 *      status: string,
 *      value: string
 * }]}
 */
async function preProcessingAllImages (
    fileNames: string[],
    settings: GeneratorOptions
) {

    const cachingOneBackgroundImageTask = async (
        fname: string
    ): Promise<string> => {
        return new Promise( (resolve) => {

            resizedImageToBuffer(
                path.resolve( bgimagesDirName, fname ),
                settings
            ).
            then( (buffer: Buffer) => {
                bgImageBuffers[fname] = buffer;
                //debug( buffer );
                console.log( `${fname} added to background images cache.` );
                resolve( fname );
            })/*.
            catch( (err: any) => {
                debug( 'CATCH: cachingOneImageTask.', err.message );
                throw err; // Обработка Этой ошибки теряется.
            })*/;
        });
    };

    try {
        const allImagesTasks = fileNames.map( cachingOneBackgroundImageTask );
        return Promise.allSettled( allImagesTasks );
    }
    catch (err) {
        debug( 'CATCH: preProcessingAllImages.', err );
        throw err; // Обработка Этой ошибки теряется.
    }
}


/**
 * Обрабатывает строки в texts: каждую накладывает на
 * изображение из cache bgImageBuffers
 * @param {[string]} texts
 * @param {{}} settings
 * {[{
 *      status: string
 *      value: string
 * }]} - массив объектов
**/
async function processingAllTexts (
    texts: string[],
    settings: GeneratorOptions
) {
    const overlayOneTextTask = async (
        text: string,
        index: number
    ): Promise<string> => {
        try {
            const imageIndex = index % Object.keys( bgImageBuffers ).length;
            //Если background картинок меньше, чем на выходе (строк текста)
            const key = Object.keys( bgImageBuffers )[ imageIndex ];
            const newImagePath = path.resolve( outputDirName, index + key );

            debug( `bgImages key is ${key}` , null && Object.keys( bgImageBuffers ));

            const imageBuffer = await createTextOnImage(
                text,
                bgImageBuffers[ key ],
                settings
            );
            const image = sharp( imageBuffer );

            //const { width, height } = await image.metadata();
            //debug( `output image : ${width} x ${height}`);
            const info = await image.
                jpeg({
                    quality: settings.jpegQuality,
                }).
                toFile( newImagePath );

            console.log( `New file with text saved to ${index+key}` );
            debug( `output sharp info:\n`, info );
            return  newImagePath;
        }
        catch (err) {
            if( err ) {
                if( err instanceof ImageGeneratorError ) {
                    console.log( err.message );
                }
                else {
                    debug( 'CATCH: overlayOneTextTask.', err );
                    //throw err;
                }
            }
            return '';
        }
    };

    try {
        console.log(`output path: ${path.resolve( outputDirName )}`);
        const allTasks = texts.map( overlayOneTextTask );
        return Promise.allSettled( allTasks );
    }
    catch (err) {
        debug( 'CATCH: processingAllTexts.', err );
        throw err;
    }
}


/**
 * Печатает один однострочный текст text на изображении bgImageBuffer
 * разбивая его на несколько строк (параметры в settings)
 * @returns
 * Объект Buffer изображения с наложенным текстом
 * @param {string} text
 * @param {Buffer} bgImageBuffer - background image Buffer
 * @param {{}} settings
 */
async function createTextOnImage (
    text: string,
    bgImageBuffer: Buffer,
    settings: GeneratorOptions
): Promise<Buffer | undefined> {

    //debug( `typeof bgImageBuffer is ${typeof bgImageBuffer}` );
    try {
        const bgCanvas = await createImagedCanvas( bgImageBuffer, settings );

        //Подбираем размер шрифта, чтобы влезал по ширине
        const newFontSize = chooseFontSize( bgCanvas, text, settings );
        if( newFontSize < MINIMAL_FONT_SIZE ) {
            throw new ImageGeneratorError(
                `Подобран размер шрифта меньше минимального - ${newFontSize}px.\n` +
                    `Есть очень длинное слово в '${text}'\n`
            );
        }
        console.log( `Подобран размер шрифта ${newFontSize}px` );
        settings.outputFontSize = newFontSize;

        const textCanvas = await printTextOnCanvas( text, bgCanvas, settings );
        //debug( `typeof 'textCanvas' is ${typeof textCanvas}`);
        console.log( `Текст "${text}" наложен на картинку\n` );

        return textCanvas.toBuffer( 'image/png' );
    }
    catch( err ) {
        if( err ) {
            debug( 'CATCH: createTextOnImage:', err );
            throw err;
        }
    }
}
