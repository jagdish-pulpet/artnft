
import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './models'; // Import the Sequelize instance and models
// import authRoutes from './routes/auth'; // Example, adjust paths as needed
// import nftRoutes from './routes/nfts'; // Example

dotenv.config(); // Load environment variables from .env file

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('ArtNFT API Server Running - Connected to Database (hopefully!)');
});

// app.use('/api/auth', authRoutes);
// app.use('/api/nfts', nftRoutes);
// Add other routes here

// Database synchronization
async function initializeDatabase() {
  try {
    // Test the connection
    await db.sequelize.authenticate();
    console.log('[server]: Connection to the database has been established successfully.');

    // Sync all models
    // Use { force: true } to drop and re-create tables - BE CAREFUL IN PRODUCTION
    // Use { alter: true } to attempt to alter existing tables to match model - SAFER FOR DEV
    // For initial setup with an existing schema.sql, you might not need to sync,
    // or you might sync with { alter: true } if your models slightly differ or add new tables.
    // If schema.sql is the source of truth, you apply it manually and then ensure models match.
    // For now, let's log that we would sync or assume manual schema application.
    // await db.sequelize.sync({ alter: true }); // Example: use alter for development
    console.log('[server]: Sequelize models were synchronized successfully (or assumed to be handled by schema.sql).');

  } catch (error) {
    console.error('[server]: Unable to connect to the database or synchronize models:', error);
    // process.exit(1); // Optionally exit if DB connection fails
  }
}


app.listen(port, async () => {
  console.log(`[server]: API Server is running at http://localhost:${port}`);
  await initializeDatabase(); // Initialize database connection and sync models
});
