import { default as debugFactory } from 'debug';
const debug = debugFactory('image');
import {
    Canvas,
    CanvasRenderingContext2D,
    createCanvas,
    Image
} from 'canvas';
//const Jimp = require( 'jimp' );

import sharp from 'sharp';

import { GeneratorOptions } from './get-settings';

export {
    chooseFontSize,
    createImagedCanvas,
    printTextOnCanvas,
    resizedImageToBuffer,
};

/**
 * Считывает файл с диска, изменяет его размер до необходимого
 * @returns возвращает в виде Buffer
 * @param {string} pathFileName - путь и полное имя файла
 * @param {{}} settings - параметры преобразования
 */
async function resizedImageToBuffer (
    pathFileName: string,
    settings: GeneratorOptions
) {
    const {
        width,
        height,
        multiplicator,
    } = settings;

    const resultWidth = width * multiplicator;
    const resultHeight = height * multiplicator;

    return sharp( pathFileName )
        .resize( resultWidth, resultHeight )
        .png()
        .toBuffer();

    /*let image = await Jimp.read( pathFileName );
    return image
        .resize( resultWidth, resultHeight )
        .getBufferAsync( Jimp.MIME_BMP );
    */
}


/**
 * Создает объект Canvas с background изображением
 * @param {Buffer} bgImageBuffer
 * @param {{}} settings
 */
async function createImagedCanvas(
    bgImageBuffer: Buffer,
    settings: GeneratorOptions
) {
    const {
        width, height,
        multiplicator,
    } = settings;

    const imagedCanvas = createCanvas(
        width * multiplicator,
        height * multiplicator
    );
    const ctx = imagedCanvas.getContext('2d');
    debug(`text canvas: ${imagedCanvas.width} x ${imagedCanvas.height}`);

    const bgImage = new Image();
    bgImage.src = bgImageBuffer;
    ctx.drawImage( bgImage, 0, 0 );

    return  imagedCanvas;
}


/**
 * Печатает один однострочный текст text на bgImagedCanvas
 * разбивая его на несколько строк (параметры в settings)
 * @returns
 * Объект Canvas изображения с наложенным текстом
 * @param {string} text
 * @param {Canvas} bgImagedCanvas - Canvas с картинкой
 * @param {{}} settings
 */
async function printTextOnCanvas(
    text: string,
    bgImagedCanvas: Canvas,
    settings: GeneratorOptions
) {
    const {
        width, height,
        font,
        multiplicator,
        outputFontSize,
    } = settings;

    //if( width !=0 ) { throw new Error('Generated test error.'); }

    const ctx = bgImagedCanvas.getContext('2d');
    debug(`text canvas: ${bgImagedCanvas.width} x ${bgImagedCanvas.height}`);

    const lineHeight = outputFontSize * font.lineHeightMultiplicator;

    const lines = wrapLines( ctx, text, settings, outputFontSize );

    const freeVerticalMargins = height * multiplicator - lines.length * lineHeight;
    let marginTop = freeVerticalMargins / 2 + lineHeight / 2;

    debug('lines of text:\n', lines );
    //Печатаем на канвасе текст
    lines
    .forEach( (line) => {

        ctx.fillStyle = font.fillStyle;
        ctx.textBaseline = font.textBaseline;
        ctx.textAlign = font.textAlign;
        ctx.shadowOffsetX = font.shadow.offsetX * multiplicator;
        ctx.shadowOffsetY = font.shadow.offsetY * multiplicator;
        ctx.shadowColor = font.shadow.color;
        ctx.shadowBlur = font.shadow.blur * multiplicator;
        ctx.strokeStyle = font.stroke.style;
        ctx.lineWidth = font.stroke.lineWidth * multiplicator;

        ctx.strokeText( line, ( width * multiplicator )/2, marginTop );
        ctx.fillText( line, ( width * multiplicator )/2, marginTop );

        ctx.shadowOffsetX = font.glow.offsetX * multiplicator;
        ctx.shadowOffsetY = font.glow.offsetY * multiplicator;
        ctx.shadowColor = font.glow.color;
        ctx.shadowBlur = lineHeight;
        ctx.fillText(line, ( width * multiplicator )/2, marginTop);

        marginTop += lineHeight;
    });
    return bgImagedCanvas;
}


/**
 * Максимально возможный размер шрифта для печати текста
 * на картинке, так чтобы всё влезло
 * @param {{Canvas}} bgCanvas - Canvas
 * @param {string} text - однострочный текст
 * @param {{}} settings - параметры
 */
function chooseFontSize (
    bgCanvas: Canvas,
    text: string,
    settings: GeneratorOptions
) {

    const {
        marginTopMultiplicator,
        maxTextWidth,
        font,
        multiplicator,
    } = settings;

    const ctx = bgCanvas.getContext( '2d' );
    let fontSize = font.size * multiplicator;
    let lines = wrapLines( ctx, text, settings, fontSize );

    if( !lines.length ) {
        // Шрифт слишком большой, какое-то из слов не влезает по ширине
        // Уменьшаем шрифт, пока всё не влезет
        //console.log( `Текущий размер ${fontSize}px - слишком большой.` );
        while(
            fontSize && !lines.length
        ){
            fontSize--; // Уменьшаем шрифт, чтобы всё влезло
            lines = wrapLines( ctx, text, settings, fontSize );
        }

        if( fontSize == 0 ) { return 0; }
    }

    // Проверяем, сколько пустого места остаётся сверху
    const canvasHeight = bgCanvas.height; //ctx.canvas.height;
    const widthMargins = bgCanvas.width - maxTextWidth * multiplicator;
    const marginTop = ( widthMargins / 2) * marginTopMultiplicator;

    let lineHeight = fontSize * font.lineHeightMultiplicator;
    let freeTopMargin = (canvasHeight - lines.length * lineHeight) / 2;

    if( freeTopMargin < marginTop ) {

        while(
            freeTopMargin < marginTop
        ){
            // Уменьшаем шрифт, чтобы отступ сверху был больше
            fontSize--;
            lines = wrapLines( ctx, text, settings, fontSize );
            lineHeight = fontSize * font.lineHeightMultiplicator;
            freeTopMargin = (canvasHeight - lines.length * lineHeight) / 2;
        }
    }
    else {
        while(
            freeTopMargin > marginTop && lines.length
        ){
            // Увеличиваем шрифт, чтобы отступ сверху стал меньше
            fontSize++;
            lines = wrapLines( ctx, text, settings, fontSize );
            lineHeight = fontSize * font.lineHeightMultiplicator;
            freeTopMargin = (canvasHeight - lines.length * lineHeight) / 2;
        }
        fontSize--; //До предыдущего, который подходил
    }
    return fontSize;
}


/**
 * Отдаёт массив со строками текста, которые влезают в максимальную ширину
 * для текста maxTextWidth при размере шрифта fontSize.
 * Если отдаёт пустой массив, то одно из слов не влезает по ширине
 * и значит шрифт нужно уменьшать
 * @param {{}} ctx - Canvas.ctx
 * @param {string} text
 * @param {{}} settings
 * @param {number} fontSize
 */
function wrapLines (
    ctx: CanvasRenderingContext2D,
    text: string,
    settings: GeneratorOptions,
    fontSize: number
) {
    const {
        multiplicator,
        maxTextWidth,
        font,
    } = settings;

    ctx.font = `${font.style} ${fontSize}px ${font.name}`;
    const spaceWidth = ctx.measureText(' ').width;
    //debug( `Размер space= ${space}px.`);

    const words = text.trim()
        .replace( /\n\n/g,' ` ' )
        .replace( /(\n\s|\s\n)/g, '\r' )
        .replace( /\s\s/g, ' ' )
        .replace( '`', ' ' )
        .replace( /(\r|\n)/g, ' '+' ' )
        .split( ' ' )
    ;

    let lineWidth = 0,
        line = '';
    const lines = [];

    for( const word of words ) {

        //debug( word ); //очень много слов выводит
        const wordWidth = word ? ctx.measureText( word ).width : 0;

        if( wordWidth > maxTextWidth * multiplicator ) {
            // Если одно слово больше по ширине, значит шрифт большой.
            return [];
        }

        if( wordWidth ) {
            lineWidth += (lineWidth ? spaceWidth : 0) + wordWidth;
        }

        if( wordWidth && lineWidth <= maxTextWidth * multiplicator ) {
            //добавляем слово к строке
            line += (line ? ' ' : '') + word;
        }
        else {
            // Начинаем новую строку
            if( line ) { lines.push( line.trim() ); }
            line = word;
            lineWidth = wordWidth;
        }
    }
    // Добавляем остаток строки
    if( line ) { lines.push( line.trim() ); }

    return lines;
}
