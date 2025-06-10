
// src/config/passport.js
// Example for JWT authentication strategy with Passport.js (if you choose to use it)
// const passport = require('passport');
// const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// const { User } = require('../models'); // Assuming User model is set up with Sequelize
// require('dotenv').config();

// const options = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET,
// };

// passport.use(
//     new JwtStrategy(options, async (payload, done) => {
//         try {
//             const user = await User.findByPk(payload.id); // 'id' or 'sub' depending on JWT payload
//             if (user) {
//                 return done(null, user);
//             }
//             return done(null, false);
//         } catch (error) {
//             return done(error, false);
//         }
//     })
// );

// module.exports = passport;
// Note: This is a placeholder. You'll need to integrate Passport into your app.js
// and protect routes using passport.authenticate('jwt', { session: false })
// Alternatively, you can implement JWT verification in a custom middleware.
console.log('Placeholder for Passport.js JWT strategy configuration.');
