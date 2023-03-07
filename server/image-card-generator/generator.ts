import { default as debugFactory } from 'debug';
const debug = debugFactory('main');
debug( process.env.NODE_ENV );

import fs from 'node:fs';
import path from 'node:path';

//const Jimp = require( 'jimp' );

import {
    chooseFontSize,
    createImagedCanvas,
    printTextOnCanvas,
    resizedImageToBuffer,
} from './image-creator';

import getSettings from './get-settings';

import sharp from 'sharp';

const MINIMAL_FONT_SIZE = 12;
class ImageGeneratorError extends Error {}


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

        let allImagesResults = await preProcessingAllImages( imagesFNames, settings );

        const imagesOk = allImagesResults.filter( (item: any) => !!item.value );
        console.log(
            `Successed buffered background images: ${imagesOk.length}\n`
        );
        debug( allImagesResults, /*'\n', bgImageBuffers*/ );

        let allTextsResults = await processingAllTexts( textsArr, settings );

        const textsOk = allTextsResults.filter( (item: any) => !!item.value );
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
async function preProcessingAllImages (fileNames: any, settings: any) {

    const cachingOneBackgroundImageTask = async (fname: any) => {
        return new Promise( (resolve) => {

            resizedImageToBuffer(
                path.resolve( bgimagesDirName, fname ),
                settings
            )
            .then( (buffer: any) => {
                bgImageBuffers[fname] = buffer;
                //debug( buffer );
                console.log( `${fname} added to background images cache.` );
                resolve( fname );
            })
            .catch( (err: any) => {
                debug( 'CATCH: cachingOneImageTask.', err.message );
                throw err; // Обработка Этой ошибки теряется.
            });
        });
    };

    return Promise.allSettled(
        fileNames.map( cachingOneBackgroundImageTask )
    )
    .catch( (err: any) => {
        debug( 'CATCH: preProcessingAllImages.', err.message );
        throw err; // Обработка Этой ошибки теряется.
    });
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
    settings: any
) {

    const overlayOneTextTask = async (
        text: string,
        index: number
    ): Promise< string > => {

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
            const info = await image
                .jpeg({
                    quality: settings.jpegQuality,
                })
                .toFile( newImagePath );

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
        return Promise.allSettled(
            texts.map( overlayOneTextTask )
        );
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
    settings: any
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

        let textCanvas = await printTextOnCanvas( text, bgCanvas, settings );
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


/**
 * Выводим ошибку в консоль и выход
 * @param text
 */
function _errorAndExit (text: any){

    console.log( `Error: ${text}` );
    process.exit(1);
}
