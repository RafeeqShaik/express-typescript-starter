import { AppAbility } from '@middleware/roles/abilities';
import { IUser, IUserDocument } from '@models/User';
import { ErrorRequestHandler } from 'express';

declare global {
  namespace Express {
    interface ErrorRequestHandler {
      isJoi?: boolean;
      status: number;
    }

    interface Request {
      user: IUserDocument;
      ability: AppAbility;
    }
  }
}
