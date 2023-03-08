import 'express-async-errors';
import express from 'express';
import startup from './src/startup';
import './src/startup/mongoose';

const app = express();
const { errorHandler, middleware, routes, Server } = startup;

// middleware
middleware(app);

// routes
routes(app);

// Error Handler
errorHandler(app);

// server
module.exports = Server(app);
