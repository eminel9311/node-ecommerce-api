import keytokenModel from '../models/keytoken.model';

interface props {
  userId: any;
  publicKey: string;
  privateKey: string;
  refreshToken: string;
}
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }: props) => {
    try {
      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens;

      const filter = {user: userId};
      const update = {
        publicKey, 
        privateKey, 
        refreshTokenUsed: [], 
        refreshToken
      };
      const options = { upsert: true, new: true};
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
