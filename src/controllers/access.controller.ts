import { Request, Response } from 'express';
import AccessService from '../services/access.service';
import { CREATED } from '../core/success.response';

class AccessController {
  signUp = async (req: Request, res: Response) => {
    // return res.status(201).json(await AccessService.signUp(req.body));
    new CREATED({
      message: 'Regiserted OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        page: 1,
        limit: 10
      }
    }).send(res);
  };
}

export default new AccessController();
