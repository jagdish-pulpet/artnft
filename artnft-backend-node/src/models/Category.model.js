
// src/models/Category.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID, // Consider if UUID is best or if auto-incrementing INT is simpler
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: { // URL-friendly version of the name
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: { // Optional: name of a Lucide icon or URL to an image
        type: DataTypes.STRING,
        allowNull: true,
    }
    // Timestamps (createdAt, updatedAt) are added by Sequelize by default
  }, {
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeValidate: (category, options) => {
            if (category.name && !category.slug) {
                category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            }
        }
    }
  });

  Category.associate = (models) => {
    // A category can have many NFTs
    Category.hasMany(models.NFT, {
      foreignKey: 'category_id',
      as: 'nfts', // Alias for the association
    });
  };

  return Category;
};
