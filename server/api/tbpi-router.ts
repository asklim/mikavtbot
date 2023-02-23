
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'router'.
const router = require( 'express' ).Router();

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
require( './tbpi/health/health-router' )( router );


router.get('/*',
    (_req: any, res: any) => {
        res.
        status( 400 ).
        json({ message: "Bad request in tbpi-router." });
    }
);

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;
