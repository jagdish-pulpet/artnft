// This file is intentionally left blank as its content has been moved to apps/api/src/server.ts
// The original content of artnft-backend-node/src/server.ts should be:
// import express, { type Express, type Request, type Response } from 'express';
// import dotenv from 'dotenv';
// // import authRoutes from './routes/auth';
// // import nftRoutes from './routes/nfts';
// // import { sequelize } from './config/database';

// dotenv.config();

// const app: Express = express();
// const port = process.env.PORT || 5000;

// app.use(express.json());

// app.get('/', (req: Request, res: Response) => {
//   res.send('ArtNFT API Server Running');
// });

// // app.use('/api/auth', authRoutes);
// // app.use('/api/nfts', nftRoutes);

// /*
// sequelize.sync()
//   .then(() => {
//     console.log('Database synced successfully.');
//     app.listen(port, () => {
//       console.log(`[server]: API Server is running at http://localhost:${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Unable to connect to the database:', error);
//   });
// */
// // Temporary listen for non-db setup
// app.listen(port, () => {
//   console.log(`[server]: API Server is running at http://localhost:${port} (DB connection pending setup)`);
// });
