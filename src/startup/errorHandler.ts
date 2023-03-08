import { Express, Request, Response, ErrorRequestHandler, NextFunction } from 'express';

export interface ExpressError extends ErrorRequestHandler {
  isJoi?: boolean;
  status: number;
  message: string;
}

export default (app: Express) => {
  app.use((_req: Request, res: Response) => {
    res.status(404).send({
      message: 'Route not found',
      status: 404,
    });
  });

  app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    const status = err.isJoi ? 400 : err.status || 500;
    const error = {
      message: err.message,
      status,
    };

    res.status(status).send({
      error,
    });

    return next();
  });
};
