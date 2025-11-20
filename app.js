const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My CI/CD Web App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          }
          h1 {
            font-size: 3em;
            margin-bottom: 20px;
            animation: fadeIn 1s ease-in;
          }
          p {
            font-size: 1.2em;
            margin: 10px 0;
          }
          .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 10px 20px;
            border-radius: 25px;
            margin: 10px;
            font-size: 0.9em;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Hello World!</h1>
          <p>Welcome to My CI/CD Pipeline Demo</p>
          <p><strong>Deployed via Jenkins + Docker + AWS</strong></p>
          <div>
            <span class="badge">✓ GitHub Integration</span>
            <span class="badge">✓ Automated Build</span>
            <span class="badge">✓ Docker Container</span>
            <span class="badge">✓ AWS Deployment</span>
          </div>
          <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
            Version: 1.0.0 | Build: ${new Date().toISOString()}
          </p>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Export the app before starting server
module.exports = app;

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
  });
}