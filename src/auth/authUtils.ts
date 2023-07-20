import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../helpers/handler.request';
import JWT from 'jsonwebtoken';
import { AuthFailureRequestError } from '../core/error.response';
import KeyTokenService from '../services/keyToken.service';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
};
const createTokenPair = async (payload: any, publicKey: string, privateKey: string) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });
    // refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });
    //
    JWT.verify(accessToken, publicKey, (err: any, decode: any) => {
      if (err) {
        console.log(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};
const authentication = asyncHandler(async(req: Request, res: Response, next: NextFunction) =>{
  /*
  1 - check userId missing?
  2 - get accessToken
  3 - verifyToken
  4 - check user in dbs
  5 - check keyStore 
  6 - return next()
  */


  //1.
  const userId: any = req.headers[HEADER.CLIENT_ID];
  if(!userId) throw new AuthFailureRequestError('Invalid Reques');

  //2.
  const keyStore = await KeyTokenService.findByUserId(userId);

})
export { createTokenPair };
