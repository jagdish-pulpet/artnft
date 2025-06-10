
// src/app.js
const express = require('express');
const cors = require('cors');
// const helmet = require('helmet'); // For security headers, consider adding
const envConfig = require('./config/environment');
const errorHandler = require('./middleware/errorHandler.middleware');

// Route imports
const authRoutes = require('./api/routes/auth.routes');
const adminAuthRoutes = require('./api/routes/admin.auth.routes');
const userRoutes = require('./api/routes/user.routes');
const nftRoutes = require('./api/routes/nft.routes');
const categoryRoutes = require('./api/routes/category.routes');
const adminUserRoutes = require('./api/routes/admin.user.routes');
const adminNftRoutes = require('./api/routes/admin.nft.routes');
// const adminCategoryRoutes = require('./api/routes/admin.category.routes'); // Categories are already admin-protected

const app = express();

// --- Global Middleware ---
app.use(cors()); // Configure properly for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet());

// --- API Routes ---
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ArtNFT Backend API! Version 1.0.1' });
});

// Authentication
app.use('/api/auth', authRoutes); // General user signup/login
app.use('/api/admin/auth', adminAuthRoutes); // Admin login

// Core Features
app.use('/api/users', userRoutes); // User profile, user's NFTs etc.
app.use('/api/nfts', nftRoutes); // Public NFT browsing, creation, bidding
app.use('/api/categories', categoryRoutes); // Public category browsing

// Admin Panel Specific Routes
app.use('/api/admin/users', adminUserRoutes); // Admin management of users
app.use('/api/admin/nfts', adminNftRoutes);   // Admin management of NFTs (e.g. status changes)
// Admin management of categories is handled by /api/categories with authorizeAdmin middleware

// --- Error Handling ---
app.use((req, res, next) => {
    const error = new Error('Not Found - The requested resource does not exist on this server.');
    error.status = 404;
    next(error);
});

app.use(errorHandler);

module.exports = app;
