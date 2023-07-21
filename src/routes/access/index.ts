import { asyncHandler } from '../../helpers/handler.request';
import AccessController from '../../controllers/access.controller';
import express from 'express';
import { authentication } from '../../auth/authUtils';

const accessRoute = express.Router();

accessRoute.post('/shop/signup', asyncHandler(AccessController.signUp));
accessRoute.post('/shop/login', asyncHandler(AccessController.login));

// authentication
accessRoute.use(authentication);
accessRoute.post('/shop/logout', asyncHandler(AccessController.logout));

export default accessRoute;
