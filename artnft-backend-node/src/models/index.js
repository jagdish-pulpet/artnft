
// src/models/index.js
// This file can be used to centralize model imports and associations if needed,
// especially if you're not defining associations directly in database.js.
// For now, database.js handles model imports.

// If you had many models and complex associations, you might do something like:
/*
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env]; // Assuming a config.json for Sequelize CLI
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
*/

// Simpler approach for now, as database.js is handling it:
const { User } = require('../config/database'); // Assuming User is exported from db object
module.exports = {
    User,
    // Add other models here as they are defined in database.js
    // NFT,
    // Category,
};
