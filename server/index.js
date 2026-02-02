/**
 * Thalos Prime - Main Server
 * Copyright (c) 2026 Tony Ray Macier III
 * 
 * Express server with WebSocket support for real-time AI interactions
 */

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import SyntheticBiologicalIntelligence from './sbi-core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Initialize SBI Core
const sbiEngine = new SyntheticBiologicalIntelligence();

console.log('🧠 Thalos Prime - Synthetic Biological Intelligence');
console.log('Copyright (c) 2026 Tony Ray Macier III');
console.log('━'.repeat(60));

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    system: 'Thalos Prime',
    version: '1.0.0',
    sbi: sbiEngine.getStatistics()
  });
});

app.post('/api/query', async (req, res) => {
  try {
    const { query, userId } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const result = await sbiEngine.processQuery(query, userId);
    res.json(result);
  } catch (error) {
    console.error('Query processing error:', error);
    res.status(500).json({ error: 'Internal processing error' });
  }
});

app.get('/api/capabilities', (req, res) => {
  res.json({
    capabilities: [
      'Natural Language Understanding',
      'Complex Computation',
      'Pattern Recognition',
      'Knowledge Synthesis',
      'Bio-Inspired Processing',
      'Adaptive Learning'
    ],
    organoids: sbiEngine.organoids.length,
    neurons: sbiEngine.organoids.reduce((sum, o) => sum + o.complexity, 0)
  });
});

// Create HTTP server
const server = createServer(app);

// WebSocket Server for real-time interactions
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket connection established');
  
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to Thalos Prime SBI Engine',
    timestamp: new Date().toISOString()
  }));
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'query') {
        const result = await sbiEngine.processQuery(data.query, data.userId);
        
        ws.send(JSON.stringify({
          type: 'response',
          data: result,
          timestamp: new Date().toISOString()
        }));
      } else if (data.type === 'stats') {
        ws.send(JSON.stringify({
          type: 'stats',
          data: sbiEngine.getStatistics(),
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Error processing message',
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`✅ Thalos Prime server running on http://localhost:${PORT}`);
  console.log(`🧠 SBI Engine initialized with ${sbiEngine.organoids.length} organoid models`);
  console.log(`🌐 WebSocket server ready for real-time interactions`);
  console.log('━'.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
