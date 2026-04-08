import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config(); // Loads .env from the root of backend folder

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/location', locationRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('Amazon Clone API is running...');
});

// Custom Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  // In a real production app, you might want to gracefully shutdown here, 
  // but for Render, logging it and letting the process restart is often sufficient.
});
