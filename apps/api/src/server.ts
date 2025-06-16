// Placeholder: Content of artnft-backend-node/src/server.ts would be moved here.
// For brevity, I'm not copying the full content of every file.
// Assume this is the original server.ts from your backend.
// Ensure all internal relative paths are correct if they existed.
import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import authRoutes from './routes/auth'; // Example, adjust paths as needed
// import nftRoutes from './routes/nfts'; // Example

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('ArtNFT API Server Running');
});

// app.use('/api/auth', authRoutes);
// app.use('/api/nfts', nftRoutes);
// Add other routes here

app.listen(port, () => {
  console.log(`[server]: API Server is running at http://localhost:${port}`);
});
