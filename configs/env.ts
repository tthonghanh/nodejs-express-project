import dotenv from "dotenv";
dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  facebookRedirectUri: process.env.FACEBOOK_REDIRECT_URI,
  vnpayTmnCode: process.env.VNPAY_TMNCODE,
  vnpayHashSecret: process.env.VNPAY_HASH_SECRET,
  vnpayReturnUrl: process.env.VNPAY_RETURN_URL,
  vnpayUrl: process.env.VNPAY_URL,
  emailName: process.env.EMAIL_NAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  authorizationCode: process.env.AUTHORIZATION_CODE,
  refreshToken: process.env.REFRESH_TOKEN,
  accessToken: process.env.ACCESS_TOKEN,
};
