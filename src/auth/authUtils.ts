import JWT from 'jsonwebtoken';
const createTokenPair = async (payload: any, publicKey:string, privateKey: string) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });
    // refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });
    //
    JWT.verify(accessToken, publicKey, (err: any, decode: any) => {
      if (err) {
        console.log(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

export { createTokenPair };
