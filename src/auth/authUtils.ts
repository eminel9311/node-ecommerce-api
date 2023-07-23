/* eslint-disable no-useless-catch */
import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../helpers/handler.request';
import JWT from 'jsonwebtoken';
import { AuthFailureRequestError, NotFoundRequestError } from '../core/error.response';
import KeyTokenService from '../services/keyToken.service';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
  REFRESHTOKEN: 'x-rtoken-id',
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
// const authentication = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
//   /*
//   1 - check userId missing?
//   2 - get accessToken
//   3 - verifyToken
//   4 - check user in dbs
//   5 - check keyStore
//   6 - return next()
//   */

//   //1.
//   const userId: any = req.headers[HEADER.CLIENT_ID];
//   if (!userId) throw new AuthFailureRequestError('Invalid Request userId');

//   //2.
//   const keyStore: any = await KeyTokenService.findByUserId(userId);
//   if (!keyStore) throw new NotFoundRequestError('Not found keyStore');

//   //3.
//   const accessToken: any = req.headers[HEADER.AUTHORIZATION];
//   if (!accessToken) throw new AuthFailureRequestError('Invalid Request At');

//   try {
//     const decodeUser: any = JWT.verify(accessToken, keyStore.publicKey);
//     if (userId !== decodeUser.userId) throw new AuthFailureRequestError('Invalid Userid');
//     req.keyStore = keyStore;
//     return next();
//   } catch (error: any) {
//     throw error;
//   }
// });
const authentication = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  //1.
  const userId: any = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureRequestError('Invalid Request userId');

  //2.
  const keyStore: any = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundRequestError('Not found keyStore');

  //3.
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refeshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser: any = JWT.verify(refeshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw new AuthFailureRequestError('Invalid Userid');
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refeshToken = refeshToken;
      return next();
    } catch (error: any) {
      throw error;
    }
  }
  //4.
  const accessToken: any = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureRequestError('Invalid Request At');

  try {
    const decodeUser: any = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) throw new AuthFailureRequestError('Invalid Userid');
    req.user = decodeUser
    req.keyStore = keyStore;
    return next();
  } catch (error: any) {
    throw error;
  }
});
export { createTokenPair, authentication };
