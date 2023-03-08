import express, { Express } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

export default (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileUpload());
};
