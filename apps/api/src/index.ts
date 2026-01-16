import app from './app.js';
import { config } from './config/index.js';

const startServer = async () => {
  try {
    // You can add database connection check here
    // await prisma.$connect();
    
    app.listen(config.port, () => {
      console.log(`
TraveNest API Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: ${config.env}
URL: http://localhost:${config.port}
API Base: http://localhost:${config.port}/api/${config.apiVersion}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
