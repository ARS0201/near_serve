const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'NearServe REST API Backend',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('NearServe Backend API Server is Running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 NearServe backend server running on http://localhost:${PORT}`);
  console.log(`📡 REST API endpoints mounted at http://localhost:${PORT}/api`);
});

module.exports = app;
