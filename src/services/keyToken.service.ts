import keytokenModel from '../models/keytoken.model';
import { Types } from 'mongoose';
interface props {
  userId: Types.ObjectId;
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

      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId: string) => {
    return await keytokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async(id: string) => {
    return await keytokenModel.findByIdAndRemove(id);
  }
}

export default KeyTokenService;
