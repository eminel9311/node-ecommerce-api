import { NextFunction, Request, Response } from 'express';
import AccessService from '../services/access.service';
import { CREATED, SuccessResponse } from '../core/success.response';

class AccessController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    // return res.status(201).json(await AccessService.signUp(req.body));
    new CREATED({
      message: 'Regiserted OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        page: 1,
        limit: 10,
      },
    }).send(res);
  };
  logout = async (req: any, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  handlerRefreshToken = async (req: any, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get token success',
      metadata: await AccessService.handlerRefreshToken({
        refreshToken: req.refeshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

export default new AccessController();
