import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { apiRouter } from './routes/index';
import { swaggerSpec } from './docs/swagger';
import { errorHandler, notFound } from './middlewares/errorHandler';

dotenv.config();

export const app = express();

app.use(cors({
  origin:true,
  credentials:true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/openapi.json', (_req, res) => {
  res.json(swaggerSpec);
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);
