
const router = require( 'express' ).Router();

require( './tbpi/health/health-router' )( router );


router.get('/*',
    (_req, res) => {
        res.
        status( 400 ).
        json({ message: "Bad request in tbpi-router." });
    }
);

module.exports = router;
