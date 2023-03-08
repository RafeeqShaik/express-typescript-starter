import { Express } from 'express';
import health from '@/resources/health';

const prefix = process.env.API_PREFIX as string;

export default (app: Express) => {
  app.use(`${prefix}/health`, health);
};
