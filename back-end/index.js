// back-end/index.js
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './config/dbStarter.js';
import formRoutes from './routes/formRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load env variables
config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/user', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Port setting
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});