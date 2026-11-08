const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Base Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'Student Assignment Workspace API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  await connectDB();
  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`[Server] Student Assignment Workspace API is running on http://localhost:${PORT}`);
      resolve({ server, app });
    });
  });
};

const stopServer = async () => {
  if (server) {
    server.close();
  }
  await disconnectDB();
};

if (require.main === module) {
  startServer();
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server gracefully...');
  await stopServer();
  process.exit(0);
});

module.exports = { app, startServer, stopServer };
