import { RequestHandler } from '@/@types/common';
import healthService from './health.service';

class HealthController {
  getHealthStatus: RequestHandler = (req, res) => {
    res.send(healthService.healthStatus());
  };
}

export default new HealthController();
