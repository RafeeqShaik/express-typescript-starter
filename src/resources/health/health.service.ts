class HealthService {
  healthStatus() {
    return { status: 'OK' };
  }
}

export default new HealthService();
