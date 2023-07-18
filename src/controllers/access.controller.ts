import { Request, Response } from 'express';
import AccessService from '../services/access.service';

class AccessController {
  signUp = async (req: Request, res: Response) => {
    return res.status(201).json(await AccessService.signUp(req.body));
  };
}

export default new AccessController();
