import { Response, Request, NextFunction } from 'express';

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
