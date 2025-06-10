
// src/api/validators/auth.validator.js
// Example using express-validator (you'll need to install it: npm install express-validator)
// const { body, validationResult } = require('express-validator');

// exports.validateSignup = [
//     body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
//     body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
//     body('username').optional().isString().trim().escape(),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         next();
//     },
// ];

// exports.validateLogin = [
//     body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
//     body('password').notEmpty().withMessage('Password is required.'),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         next();
//     },
// ];
console.log('Placeholder for authentication request validators (e.g., using express-validator).');
