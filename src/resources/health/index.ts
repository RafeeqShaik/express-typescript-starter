import express from 'express';
import healthController from './health.controller';

const router = express.Router();

router.get('/', healthController.getHealthStatus);

export default router;
