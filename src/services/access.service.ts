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
      const passwordHash = await bcript.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [roleShop.SHOP],
      });
      if (newShop) {
        // created privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          }
        });
        console.log({ privateKey, publicKey }); // save collection KeyStore
        const publicKeyString: any = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: 400,
            message: 'publicKeyString error',
          };
        };
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
          privateKey
        );
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
      console.log('errr', error)
      return {
        code: '400',
        message: error.message,
      };
    }
  };
}

export default AccessService;
