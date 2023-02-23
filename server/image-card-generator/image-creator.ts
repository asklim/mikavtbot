// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'debug'.
const debug = require( 'debug' )( 'image' );
const { 
    createCanvas, 
    // @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Image'.
    Image 
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
} = require( 'canvas' );
//const Jimp = require( 'jimp' );
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'sharp'.
const sharp = require( 'sharp' );

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
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
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resizedIma... Remove this comment to see the full error message
async function resizedImageToBuffer (pathFileName: any, settings: any) {

    const {
        width,
        height,
        multiplicator,
    } = settings;
    
    const resultWidth = width * multiplicator;
    const resultHeight = height * multiplicator;   
        
    return await sharp( pathFileName )
        .resize( resultWidth, resultHeight )
        .png()
        .toBuffer();

    /*let image = await Jimp.read( pathFileName );
    return await image
        .resize( resultWidth, resultHeight )
        .getBufferAsync( Jimp.MIME_BMP );
    */
}


/**
 * Создает объект Canvas с background изображением
 * @param {Buffer} bgImageBuffer
 * @param {{}} settings 
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createImag... Remove this comment to see the full error message
function createImagedCanvas( bgImageBuffer: any, settings: any ) {

    const {
        width, height,
        multiplicator,
    } = settings;

    const imagedCanvas = createCanvas( 
        width * multiplicator, 
        height * multiplicator 
    );
    const ctx = imagedCanvas.getContext( '2d' );
    debug( `text canvas: ${ctx.canvas.width} x ${ctx.canvas.height}`);

    const bgImage = new Image();
    bgImage.src = bgImageBuffer;
    ctx.drawImage( bgImage, 0, 0 );

    return Promise.resolve( imagedCanvas );
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
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'printTextO... Remove this comment to see the full error message
function printTextOnCanvas( text: any, bgImagedCanvas: any, settings: any ) {

    const {
        width, height,
        font,
        multiplicator,
        outputFontSize,
    } = settings;

    if( width !=0 ) { throw new Error( 'Generated test error.' ); }

    const ctx = bgImagedCanvas.getContext( '2d' );
    debug( `text canvas: ${ctx.canvas.width} x ${ctx.canvas.height}`);

    let lineHeight = outputFontSize * font.lineHeightMultiplicator;

    let lines = wrapLines( ctx, text, settings, outputFontSize );

    let freeVerticalMargins = height * multiplicator - lines.length * lineHeight;
    let marginTop = freeVerticalMargins / 2 + lineHeight / 2;

    debug( 'lines of text:\n', lines );   
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
    return Promise.resolve( bgImagedCanvas );
}


/**
 * Максимально возможный размер шрифта для печати текста 
 * на картинке, так чтобы всё влезло
 * @param {{Canvas}} bgCanvas - Canvas
 * @param {string} text - однострочный текст
 * @param {{}} settings - параметры 
 */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'chooseFont... Remove this comment to see the full error message
function chooseFontSize (bgCanvas: any, text: any, settings: any) {

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
    const canvasHeight = ctx.canvas.height;
    const widthMargins = ctx.canvas.width - maxTextWidth * multiplicator;
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
function wrapLines (ctx: any, text: any, settings: any, fontSize: any) {
    
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

    for( let word of words ) {

        //debug( word ); //очень много слов выводит
        let wordWidth = word ? ctx.measureText( word ).width : 0;

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