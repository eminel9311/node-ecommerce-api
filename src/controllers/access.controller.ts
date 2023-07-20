import { NextFunction, Request, Response } from 'express';
import AccessService from '../services/access.service';
import { CREATED, SuccessResponse } from '../core/success.response';

class AccessController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res);
  }
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
}

export default new AccessController();
