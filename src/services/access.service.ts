import shopModel from '../models/shop.model';
import bcript from 'bcrypt';
import crypto from 'crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import { BadRequestError, ConflictRequestError } from '../core/error.response';

const roleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};
class AccessService {
  static signUp = async ({ name, email, password }: any) => {
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
