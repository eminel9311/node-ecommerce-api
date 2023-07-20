import shopModel from '../models/shop.model';
import bcript from 'bcrypt';
import crypto from 'crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import {
  BadRequestError,
  ConflictRequestError,
  AuthFailureRequestError,
} from '../core/error.response';
import { findByEmail } from './shop.service';
import { GenKeyPair, getInfoData } from '../utils';

const roleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};
interface SignupProperty {
  name: string;
  email: string;
  password: string;
}
interface LoginProperty {
  email: string;
  password: string;
  refreshToken?: string;
}
class AccessService {
  // 1 - check email in dbs
  // 2 - match password
  // 3 - create AT and RT and save
  // 4 - generate tokens
  // 5 - get data return login

  static login = async ({ email, password, refreshToken = '' }: LoginProperty) => {
    //1.
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop not registered!');

    //2.
    const matchPassword = bcript.compare(password, foundShop.password);
    if (!matchPassword) throw new AuthFailureRequestError();

    // 3.
    const { PrivateKey, PublicKey } = GenKeyPair;

    //4.
    const tokens: any = await createTokenPair(
      { userId: foundShop._id, email },
      PublicKey,
      PrivateKey
    );

    //5.

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      publicKey: PublicKey,
      privateKey: PrivateKey,
      userId: foundShop._id,
    });

    return {
      metadata: {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
        tokens,
      },
    };
  };
  static signUp = async ({ name, email, password }: SignupProperty) => {
    // step1: check email exists?
    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop) {
      throw new ConflictRequestError('Shop already registered!');
    }
    const algorithmDifficultyHash = 10;
    const passwordHash = await bcript.hash(password, algorithmDifficultyHash);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [roleShop.SHOP],
    });
    if (newShop) {
      // created privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      console.log('rawKey', { privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: '',
      });
      if (!keyStore) {
        throw new BadRequestError('keyStore error!');
      }

      // create token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
      console.log(`Created Token succees::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: newShop,
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

export default AccessService;
