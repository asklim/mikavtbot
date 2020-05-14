const debug = require( 'debug' )('lib:raw:via-axios');

const axios = require( 'axios' ).default;


//class ZeroSizeError extends Error {}
class NetworkError extends Error {}



async function getStreamImageFrom( url ) {


    /***  
     *  @param  {string} url - полный адрес для скачивания изображения
     *  @return {IncomingMessage} -  readable Stream
     *  see 'data-samples/IncomingMessage.log'
    */

    let getOptions = {
    
        method: 'GET',
        url,
        responseType: 'stream',
        headers: {
            "Cache-Control": 'no-cache',
        },
    };

    try {    
        let axiosResponse = await axios( getOptions );

        //debug(`axios 'GET' Response:`)
        //console.log( axiosResponse );

        //*****INFO: response is Axios Response Object 
        //http://zetcode.com/javascript/axios/

        //*****INFO: axiosResponse.data is IncomingMessage Object
    
        let readable = axiosResponse.data;

     return readable
        .on( 'error', (err) => {

            debug( `E: readable.on: ERROR image reading from '${url}'` );
        });
    } 
    catch (error) {

        debug( `E: catch block in 'getStreamImageFrom'\n`, error );
    }
}



function postImageTo( options ) {


  return axios( options )

    .then( checkStatus )    
    .then( axiosResponse => axiosResponse.data )
    .then( response2console )
    .then( telegramResponse =>      // from Telegram Server
    {
        if( telegramResponse.ok ) 
        {
            
            let dt = Date( telegramResponse.result.date );
            let isoDate = (new Date( dt )).toISOString();
            //isoDate = isoDate.toISOString();
            //Если сразу сделать dt = new Date( ... ), то получается 
            //at 1970-01-19T09:08:08.067Z, Mon Jan 19 1970 12:08:08 GMT+0300 //(Moscow Standard Time)
            // data.result.date = 1588088067

            let { file_id } = telegramResponse.result.photo[0];

            console.log( `SUCCESS: image uploaded at ${isoDate}, ${dt}`);
            console.log( `file_id: ${file_id}` );
        } 
        else {
            debug( `uploading error, data:\n`, telegramResponse );        
        }
        return telegramResponse.ok;
        
    })
    .catch( error => 
    {
        debug( `catch: ERROR in 'uploadPhoto'\n`, error );                  
    });
}




module.exports = {

    NetworkError,
    getStreamImageFrom,
    postImageTo,
    
};




function response2console( response ) {

    console.log('response:');
    console.log( response );
    return response;
}



function checkStatus( response ) {


    debug('check Status running ...');
    //console.log( response );

    if( response.status > 199 && response.status < 300 )
    {     
        debug('check Status is Ok.');                
    } 
    else {        

        let { status, statusText } = response;
        debug( `ERROR: uploading status = ${status}, ${statusText}`);
    }

    return response;
}

