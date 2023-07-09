import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import instanceMongodb from './dbs/init.mongodb';
import { checkOverload } from './helpers/check.connect';
import router from './routes/index';

const app = express();
// init middlewares
// app.use(morgan('dev'));
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init database
instanceMongodb;
// checkOverload();
// init routes
app.use('', router);
// app.get('/test', (_req: Request, res: Response) => {
//   const strCompress = 'Hello every body';
//   return res.status(200).json({
//     message: 'Welcome New World',
//     metadata: strCompress.repeat(100000),
//   });
// });
// handling error

export default app;
