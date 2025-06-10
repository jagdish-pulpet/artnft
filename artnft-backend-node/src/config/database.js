
// src/config/database.js
const { Sequelize } = require('sequelize');
const envConfig = require('./environment');

const sequelize = new Sequelize(
    envConfig.db.name,
    envConfig.db.user,
    envConfig.db.password,
    {
        host: envConfig.db.host,
        port: envConfig.db.port,
        dialect: envConfig.db.dialect, // Use dialect from environment config
        logging: envConfig.nodeEnv === 'development' ? console.log : false,
        dialectOptions: {
            // PostgreSQL specific options can go here if needed
            // ssl: envConfig.db.ssl, // Example for SSL
        },
        pool: {
            max: envConfig.db.poolMax,
            min: envConfig.db.poolMin,
            acquire: envConfig.db.poolAcquire,
            idle: envConfig.db.poolIdle
        },
        define: {
            timestamps: true,
            underscored: true, // Use snake_case for automatically added attributes like foreign keys
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('../models/User.model')(sequelize);
db.Category = require('../models/Category.model')(sequelize);
db.NFT = require('../models/NFT.model')(sequelize);
// Add other models here as they are created e.g.
// db.Collection = require('../models/Collection.model')(sequelize);
// db.Bid = require('../models/Bid.model')(sequelize);
// db.Favorite = require('../models/Favorite.model')(sequelize);
// db.Transaction = require('../models/Transaction.model')(sequelize);
// db.Notification = require('../models/Notification.model')(sequelize);
// db.UserNotificationPreference = require('../models/UserNotificationPreference.model')(sequelize);
// db.UserFollow = require('../models/UserFollow.model')(sequelize);
// db.Report = require('../models/Report.model')(sequelize);
// db.AdminAuditLog = require('../models/AdminAuditLog.model')(sequelize);
// db.PlatformSetting = require('../models/PlatformSetting.model')(sequelize);
// db.Promotion = require('../models/Promotion.model')(sequelize);


// Define associations here if any model has associate static method
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) { // Check if model is defined before calling associate
    db[modelName].associate(db);
  }
});


module.exports = db;
