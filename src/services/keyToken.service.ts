import keytokenModel from '../models/keytoken.model';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }: any) => {
    try {
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return tokens;
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
