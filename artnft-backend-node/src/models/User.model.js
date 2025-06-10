
// src/models/User.model.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID, // Keep UUID for User ID as it was specified in schema for gen_random_uuid()
      defaultValue: DataTypes.UUIDV4, // Sequelize can generate this if not provided by DB default
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    wallet_address: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'), // Sequelize handles ENUM to VARCHAR with CHECK or native ENUM
      defaultValue: 'user',
      allowNull: false,
    }
    // Timestamps (createdAt, updatedAt) are added by Sequelize by default
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash && !user.password_hash.startsWith('$2a$')) { // Hash only if not already hashed
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash') && user.password_hash && !user.password_hash.startsWith('$2a$')) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      }
    }
  });

  User.prototype.isValidPassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };
  
  User.associate = (models) => {
    User.hasMany(models.NFT, { as: 'createdNfts', foreignKey: 'creator_id' });
    User.hasMany(models.NFT, { as: 'ownedNfts', foreignKey: 'owner_id' });
    // Add other associations like Bids, Favorites, Collections, Notifications, etc.
    // User.hasMany(models.Collection, { foreignKey: 'user_id', as: 'collections' });
    // User.hasMany(models.Bid, { foreignKey: 'user_id', as: 'bids' });
    // User.hasMany(models.Favorite, { foreignKey: 'user_id', as: 'favorites' });
  };

  return User;
};
