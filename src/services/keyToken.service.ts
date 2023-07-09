import keytokenModel from '../models/keytoken.model';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }: any) => {
    try {
      //publicKey is buffer => convert to string
      const publicKeyString = publicKey.toString();
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return tokens ? publicKeyString : null;
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
