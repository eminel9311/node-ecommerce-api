import JWT from 'jsonwebtoken';
const createTokenPair = async (payload: any, publicKey: any, privateKey: any) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });
    // refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });
    // verify
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
