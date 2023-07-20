import crypto from 'crypto';
import _ from 'lodash';
export const GenKeyPair = {
  PrivateKey: crypto.randomBytes(64).toString('hex'),
  PublicKey: crypto.randomBytes(64).toString('hex'),
};

export const getInfoData = ({ fields = [], object = {} }: any) => {
  return _.pick(object, fields);
};
