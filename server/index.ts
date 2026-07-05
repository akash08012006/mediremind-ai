import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import { initializeDatabase } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the React app in production
if (isProduction) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Handle React routing, return all requests to React app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

async function start() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
