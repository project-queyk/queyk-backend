import app from './app';
import { createServer } from 'http';
import { initializeSocket } from './lib/socket';

const port = process.env.PORT || 8080;

const server = createServer(app);
initializeSocket(server);

if (process.env.NODE_ENV !== 'production') {
  server.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default server;
