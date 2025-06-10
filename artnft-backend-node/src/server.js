
// src/server.js
const envConfig = require('./config/environment');
const app = require('./app');
const { sequelize } = require('./config/database'); // Sequelize instance from database.js

const PORT = envConfig.port;

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync database models
        // In development, you might use { alter: true } or { force: true } (careful with force: true as it drops tables)
        // For production, migrations are preferred over sync.
        if (envConfig.nodeEnv === 'development') {
            // await sequelize.sync({ alter: true }); // Or { force: true } if you want to drop and recreate tables
             await sequelize.sync(); // Just sync without altering if tables exist and match
            console.log("All models were synchronized successfully (Development Sync).");
        } else {
            console.log("Production mode: Database synchronization skipped. Use migrations.");
        }


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Access it at http://localhost:${PORT}`);
            console.log(`Environment: ${envConfig.nodeEnv}`);
        });
    } catch (error) {
        console.error('Unable to start the server or connect to the database:', error);
        process.exit(1); // Exit if server can't start
    }
}

startServer();
