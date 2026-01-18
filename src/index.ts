import app from './app';
import { createServer } from 'http';
import { initializeSocket } from './lib/socket';

const port = process.env.PORT || 8080;

const server = createServer(app);
initializeSocket(server);

let monitoringInterval: NodeJS.Timeout | null = null;
try {
  const { startDeviceMonitoring } = require('./lib/service/device-monitor-service');
  monitoringInterval = startDeviceMonitoring();
} catch {
}

if (process.env.NODE_ENV !== 'production') {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

process.on('SIGTERM', () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
  server.close(() => {
  });
});

export default server;

