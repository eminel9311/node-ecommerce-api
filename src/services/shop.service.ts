import shopModel from '../models/shop.model';

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  },
}: any) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

export {
  findByEmail
}