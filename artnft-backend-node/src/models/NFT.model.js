
// src/models/NFT.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NFT = sequelize.define('NFT', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING, // URL to the image stored externally (e.g., IPFS, S3)
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    price_eth: { // Current price if for sale, or starting bid if auction
      type: DataTypes.DECIMAL(18, 8), // Precision for ETH values
      allowNull: true, // Might be null if not for sale or only auction starting bid shown elsewhere
    },
    currency_symbol: {
      type: DataTypes.STRING(10),
      defaultValue: 'ETH',
      allowNull: false,
    },
    status: { // e.g., 'pending_moderation', 'listed', 'on_auction', 'sold', 'hidden'
      type: DataTypes.STRING,
      defaultValue: 'pending_moderation',
      allowNull: false,
    },
    is_auction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    auction_ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    creator_id: { // Foreign Key to Users table
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Name of the users table
        key: 'id',
      },
    },
    owner_id: { // Foreign Key to Users table (current owner)
      type: DataTypes.UUID,
      allowNull: true, // Can be null if newly minted by creator and not yet sold
      references: {
        model: 'users',
        key: 'id',
      },
    },
    category_id: { // Foreign Key to Categories table
      type: DataTypes.UUID, // Ensure this matches the type of your category ID
      allowNull: true, // Or false if every NFT must have a category
      references: {
        model: 'categories', // Name of the categories table
        key: 'id',
      },
    },
    tags: { // Store tags as a JSON array of strings, or use a separate join table for more complex tagging
      type: DataTypes.JSON, 
      allowNull: true,
    },
    collection_id: { // Optional: if NFTs belong to collections
        type: DataTypes.UUID,
        allowNull: true,
        // references: { model: 'collections', key: 'id' } // If you have a collections table
    },
    // Timestamps (createdAt, updatedAt) are added by Sequelize by default (config/database.js)
  }, {
    tableName: 'nfts',
    timestamps: true,
    underscored: true,
  });

  NFT.associate = (models) => {
    NFT.belongsTo(models.User, {
      foreignKey: 'creator_id',
      as: 'creator', // Alias for the association
    });
    NFT.belongsTo(models.User, {
      foreignKey: 'owner_id',
      as: 'owner',
    });
    NFT.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    // Add other associations like Bids, Favorites, etc.
    // Example: NFT.hasMany(models.Bid, { foreignKey: 'nft_id', as: 'bids' });
  };

  return NFT;
};
