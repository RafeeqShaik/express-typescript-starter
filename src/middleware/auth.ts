import { RequestHandler } from '@/@types/common';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

const auth: RequestHandler = (req, _res, next) => {
  const token = req.header('x-auth-token');

  if (!token) throw createError.Unauthorized('access-token missing');
  // TODO: update decoded object
  const decoded = jwt.verify(token, process.env['JWT-SECRET'] as string);
  req.user = decoded;

  next();
};

export default auth;
