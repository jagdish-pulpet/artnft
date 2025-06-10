
// src/models/NFT.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NFT = sequelize.define('NFT', {
    id: {
      type: DataTypes.UUID, // Keeping NFT ID as UUID as per new schema
      defaultValue: DataTypes.UUIDV4, // Sequelize can generate this
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    price_eth: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: true,
    },
    currency_symbol: {
      type: DataTypes.STRING(10),
      defaultValue: 'ETH',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending_moderation', 'listed', 'on_auction', 'sold', 'hidden', 'draft'),
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
    creator_id: { // Foreign Key to Users table (UUID)
      type: DataTypes.UUID,
      allowNull: false,
    },
    owner_id: { // Foreign Key to Users table (UUID)
      type: DataTypes.UUID,
      allowNull: true,
    },
    category_id: { // Foreign Key to Categories table (INTEGER for SERIAL PK)
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    collection_id: { // Foreign Key to Collections table (INTEGER for SERIAL PK)
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB, // Changed to JSONB for PostgreSQL
      allowNull: true,
    },
    metadata_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    royalty_percentage: {
        type: DataTypes.DECIMAL(5,2),
        defaultValue: 0.00,
    },
    unlockable_content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
  }, {
    tableName: 'nfts',
    timestamps: true,
    underscored: true,
  });

  NFT.associate = (models) => {
    NFT.belongsTo(models.User, {
      foreignKey: 'creator_id',
      as: 'creator',
    });
    NFT.belongsTo(models.User, {
      foreignKey: 'owner_id',
      as: 'owner',
    });
    NFT.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    // Example: NFT.belongsTo(models.Collection, { foreignKey: 'collection_id', as: 'collection' });
    // Example: NFT.hasMany(models.Bid, { foreignKey: 'nft_id', as: 'bids' });
  };

  return NFT;
};
