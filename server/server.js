import app from './src/app.js';
import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';

async function startServer() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

startServer();
