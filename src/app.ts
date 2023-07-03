import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
const app = express();

// init middlewares
// app.use(morgan('dev'));
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
// init database

// init routes
app.get('/test', (_req: Request, res: Response) => {
  const strCompress = 'Hello every body'
  return res.status(200).json({
    message: 'Welcome New World',
    metadata: strCompress.repeat(100000)
  });
});
// handling error

export default app;
