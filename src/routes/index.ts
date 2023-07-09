import express from 'express';
import accessRoute from './access';

const router = express.Router();

router.use('/v1/api', accessRoute);

export default router;
