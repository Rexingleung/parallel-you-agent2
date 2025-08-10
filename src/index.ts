import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeAgent } from './agents/parallelAgent.js';
import { setupRoutes } from './routes/index.js';
import { logger } from './utils/logger.js';
import { initializeDatabase } from './services/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the application
async function initialize() {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Initialize Mastra agent
    const agent = await initializeAgent();
    logger.info('Parallel Agent initialized successfully');

    // Setup routes
    setupRoutes(app, agent);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        agent: 'parallel-you-agent2'
      });
    });

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Parallel You Agent server running on http://localhost:${PORT}`);
      logger.info('🌌 Ready to explore parallel universes!');
    });

  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the application
initialize();