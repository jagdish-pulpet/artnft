
// src/config/database.ts
import { Sequelize, type Dialect, type ModelCtor } from 'sequelize';
import envConfig from './environment';

import initUserModel, { type UserInstance } from '../models/User.model';
import initCategoryModel, { type CategoryInstance } from '../models/Category.model';
import initNFTModel, { type NFTInstance } from '../models/NFT.model';
// Import other model initializers and instance types as they are created

const sequelize = new Sequelize(
    envConfig.db.name,
    envConfig.db.user,
    envConfig.db.password,
    {
        host: envConfig.db.host,
        port: envConfig.db.port,
        dialect: envConfig.db.dialect as Dialect, // Cast to Dialect
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

interface Db {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    User: ModelCtor<UserInstance>;
    Category: ModelCtor<CategoryInstance>;
    NFT: ModelCtor<NFTInstance>;
    // Add other models here with their types
    // Collection?: ModelCtor<CollectionInstance>;
    // Bid?: ModelCtor<BidInstance>;
    // ...
    [key: string]: any; // Allow other models to be added dynamically if needed
}

const db: Db = {
    sequelize,
    Sequelize,
    User: initUserModel(sequelize),
    Category: initCategoryModel(sequelize),
    NFT: initNFTModel(sequelize),
    // Initialize other models here
    // Collection: initCollectionModel(sequelize),
    // Bid: initBidModel(sequelize),
};

// Define associations here if any model has a static associate method
// This pattern is common if associations are defined within model files
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db); // Pass the full db object for associations
  }
});


// Manual associations if not using static associate methods in models
// Example:
// db.User.hasMany(db.NFT, { as: 'createdNfts', foreignKey: 'creator_id' });
// db.User.hasMany(db.NFT, { as: 'ownedNfts', foreignKey: 'owner_id' });
// db.NFT.belongsTo(db.User, { as: 'creator', foreignKey: 'creator_id' });
// db.NFT.belongsTo(db.User, { as: 'owner', foreignKey: 'owner_id' });
// db.Category.hasMany(db.NFT, { as: 'nfts', foreignKey: 'category_id' });
// db.NFT.belongsTo(db.Category, { as: 'category', foreignKey: 'category_id' });


export { db, sequelize }; // Export named db and sequelize instance
export default db; // Default export for convenience
