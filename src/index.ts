import app from './app';
import { createServer } from 'http';
import { initializeSocket } from './lib/socket';
import { startDeviceMonitoring } from './lib/service/device-monitor-service';

const port = process.env.PORT || 8080;

const server = createServer(app);
initializeSocket(server);

let monitoringInterval: NodeJS.Timeout | null = null;
if (process.env.NODE_ENV !== 'production') {
  monitoringInterval = startDeviceMonitoring();
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
