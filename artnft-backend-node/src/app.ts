
// src/app.ts
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
// import helmet from 'helmet'; // For security headers, consider adding
import errorHandler from './middleware/errorHandler.middleware';
import AppError from './utils/AppError';

// Route imports (now .ts)
import authRoutes from './api/routes/auth.routes';
import adminAuthRoutes from './api/routes/admin.auth.routes';
import userRoutes from './api/routes/user.routes';
import nftRoutes from './api/routes/nft.routes';
import categoryRoutes from './api/routes/category.routes';
import adminUserRoutes from './api/routes/admin.user.routes';
import adminNftRoutes from './api/routes/admin.nft.routes';

const app: Express = express();

// --- Global Middleware ---
app.use(cors()); // Configure properly for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet());

// --- API Routes ---
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to ArtNFT Backend API! Version 1.0.1 (TypeScript)' });
});

// Authentication
app.use('/api/auth', authRoutes); 
app.use('/api/admin/auth', adminAuthRoutes); 

// Core Features
app.use('/api/users', userRoutes); 
app.use('/api/nfts', nftRoutes); 
app.use('/api/categories', categoryRoutes); 

// Admin Panel Specific Routes
app.use('/api/admin/users', adminUserRoutes); 
app.use('/api/admin/nfts', adminNftRoutes);   
// Admin management of categories is handled by /api/categories with authorizeAdmin middleware

// --- Error Handling ---
// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError('Not Found - The requested resource does not exist on this server.', 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
