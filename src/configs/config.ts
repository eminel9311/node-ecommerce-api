import 'dotenv/config';
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'node_ecommerce_api',
    user: process.env.DEV_DB_USER || 'user',
    password: process.env.DEV_DB_PASSWORD || 'pass'
  }
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3052
  },
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || 'node_ecommerce_api',
    user: process.env.PRO_DB_USER || 'user',
    password: process.env.PRO_DB_PASSWORD || 'pass'
  }
};

const config: { [key: string]: { app: { port: string | number }, db: { host: string, port: string | number, name: string, user: string, password: string } } } = { dev, pro };

const env = process.env.NODE_ENV || 'dev';
export default config[env];