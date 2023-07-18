import { asyncHandler } from '../../auth/checkAuth';
import AccessController from '../../controllers/access.controller';
import express from 'express';

const accessRoute = express.Router();

accessRoute.post('/shop/signup', asyncHandler(AccessController.signUp));

export default accessRoute;
