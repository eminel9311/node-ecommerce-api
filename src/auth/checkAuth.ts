import { NextFunction, Request, Response } from 'express';
import { findById } from '../services/apiKey.service';
import { ForbindenRequestError } from '../core/error.response';
import { asyncHandler } from '../helpers/handler.request';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};
interface CustomRequest extends Request {
  objKey?: {
    key?: string;
    status?: boolean;
    permission?: string[];
  };
}

const apiKey = async (req: CustomRequest, _res: Response, next: NextFunction) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    throw new ForbindenRequestError('apiKey not found!');
  }
  // check objKey
  const objKey = await findById(key);
  if (!objKey) {
    throw new ForbindenRequestError('objKey not found!');
  }
  req.objKey = objKey;
  return next();
};

const permission = (requiredPermission: string) => {
  return (req: CustomRequest, _res: Response, next: NextFunction) => {
    if (!req.objKey || !req.objKey.permission) {
      throw new ForbindenRequestError('objKey error!');
    }
    const validPermission = req.objKey.permission.includes(requiredPermission);
    if (!validPermission) {
      throw new ForbindenRequestError('valid permission false!');
    }
    return next();
  };
};

const wrappedApiKey = asyncHandler(apiKey);

export { wrappedApiKey, permission };
