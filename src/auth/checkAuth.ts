import { findById } from '../services/apiKey.service';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};
const apiKey = async (req: any, res: any, next: any) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbinden Error',
      });
    }
    // check objKey

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbinden Error',
      });
    };
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

const permission = (requiredPermission: any) => {
  return (req: any, res: any, next: any) => {
    console.log('req.objKey', req.objKey)

    if (!req.objKey || !req.objKey.permission) {
      return res.status(403).json({
        message: 'Permission denied'
      });
    }

    const validPermission = req.objKey.permission.includes(requiredPermission);

    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied'
      });
    }

    return next();
  };
};


export { apiKey,permission };
