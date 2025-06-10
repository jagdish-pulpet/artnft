
// src/config/database.js
const { Sequelize, DataTypes } = require('sequelize');
const envConfig = require('./environment'); // Use processed environment variables

const sequelize = new Sequelize(
    envConfig.db.name,
    envConfig.db.user,
    envConfig.db.password,
    {
        host: envConfig.db.host,
        port: envConfig.db.port,
        dialect: 'mysql',
        logging: envConfig.nodeEnv === 'development' ? console.log : false, // Log SQL queries in development
        dialectOptions: {
            // SSL options for production if needed
            // ssl: {
            //   require: true,
            //   rejectUnauthorized: false // Adjust based on your SSL certificate
            // }
        },
        pool: {
            max: envConfig.db.poolMax || 5,
            min: envConfig.db.poolMin || 0,
            acquire: envConfig.db.poolAcquire || 30000,
            idle: envConfig.db.poolIdle || 10000
        },
        define: {
            timestamps: true, // Automatically add createdAt and updatedAt fields
            underscored: true, // Use snake_case for automatically added attributes like foreign keys
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
// Note: Models accept sequelize instance. DataTypes is available via sequelize.DataTypes or imported directly.
db.User = require('../models/User.model')(sequelize);
db.Category = require('../models/Category.model')(sequelize);
db.NFT = require('../models/NFT.model')(sequelize);
// Add other models here as they are created e.g.
// db.Bid = require('../models/Bid.model')(sequelize);
// db.Favorite = require('../models/Favorite.model')(sequelize);


// Define associations here if any model has associate static method
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;
