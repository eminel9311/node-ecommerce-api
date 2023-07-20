import { asyncHandler } from '../../helpers/handler.request';
import AccessController from '../../controllers/access.controller';
import express from 'express';

const accessRoute = express.Router();

accessRoute.post('/shop/signup', asyncHandler(AccessController.signUp));
accessRoute.post('/shop/login', asyncHandler(AccessController.login));

export default accessRoute;
