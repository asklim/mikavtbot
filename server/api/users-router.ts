import express, {
    Request,
    Response
} from 'express';

const router = express.Router();

/* GET users list. */
router.get('/',
    (_req: Request, res: Response) => res.
        send('respond with a resource from <users/> route.')
);

export default router;
