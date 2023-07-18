import shopModel from '../models/shop.model';
import bcript from 'bcrypt';
import crypto from 'crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';

const roleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};
class AccessService {
  static signUp = async ({ name, email, password }: any) => {
    try {
      // step1: check email exists?
      const hodelShop = await shopModel.findOne({ email }).lean();
      if (hodelShop) {
        return {
          code: 409,
          message: 'Shop already registered',
        };
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
        });
        if (!keyStore) {
          return {
            code: 400,
            message: 'keyStore error',
          };
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
    } catch (error: any) {
      console.log('errr', error);
      return {
        code: '400',
        message: error.message,
      };
    }
  };
}

export default AccessService;
