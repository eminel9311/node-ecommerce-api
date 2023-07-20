import apiKeyModel from '../models/apiKey.model';
// import crypto from 'crypto';
const findById = async (key: string) => {
  // const newKey = await apiKeyModel.create({
  //   key: crypto.randomBytes(64).toString('hex'),
  //   permission: ['0000'],
  // });
  // console.log(newKey);
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean(); // return light weigth object
  return objKey;
};

export { findById };
