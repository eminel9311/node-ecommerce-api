import AccessController from '../../controllers/access.controller';
import express, { Request, Response } from 'express';

const accessRoute = express.Router();

accessRoute.post('/shop/signup', AccessController.signUp);

export default accessRoute;
