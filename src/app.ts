import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import instanceMongodb from './dbs/init.mongodb';
// import { checkOverload } from './helpers/check.connect';
import router from './routes/index';
import { ErrorResponse, NotFoundRequestError } from './core/error.response';

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
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: NotFoundRequestError = new NotFoundRequestError();
  next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: ErrorResponse, _req: Request, _res: Response, _next: NextFunction) => {
  const statusCode = error.status || 500;
  return _res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    error: error.stack,
    message: error.message || 'Internal Server Error',
  });
});
export default app;
