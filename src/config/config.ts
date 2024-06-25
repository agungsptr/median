import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  app: {
    PORT: process.env.APP_PORT,
    VER: process.env.APP_VER,
  },
  jwt: {
    SECRET: process.env.JWT_SECRET_KEY,
    EXPIRES: process.env.JWT_EXPIRES,
  },
  pg: {
    HOST: process.env.PG_HOST,
    PORT: process.env.PG_PORT,
    USER: process.env.PG_USER,
    PASS: process.env.PG_PASS,
    DBNAME: process.env.PG_DBNAME,
    URL: process.env.DATABASE_URL,
  },
  API_PREFIX: `api/${process.env.APP_VER}`,
};
