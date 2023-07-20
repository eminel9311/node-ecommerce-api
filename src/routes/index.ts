import express from 'express';
import accessRoute from './access';
import { wrappedApiKey, permission } from '../auth/checkAuth';

const router = express.Router();

// check apiKey
router.use(wrappedApiKey);
// check permission
router.use(permission('0000'));
router.use('/v1/api', accessRoute);

export default router;
