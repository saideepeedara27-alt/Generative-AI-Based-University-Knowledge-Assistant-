import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';
import { chatRouter } from './routes/chatRoutes.js';

export const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173,http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'not configured' });
});

app.use('/api', chatRouter);
app.use(errorHandler);
