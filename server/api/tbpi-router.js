
const router = require( 'express' ).Router();

require( '../api/tbpi/config/ping/rout-ping' )( router );


router.get('/*', 
    (_req, res) => {
        res.status( 400 );
        res.json({ message: "Bad request in tbpi-router." });
    }
);


module.exports = router;
