
// src/models/Category.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER, // Changed from UUID to INTEGER for SERIAL PK
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
    }
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
    Category.hasMany(models.NFT, {
      foreignKey: 'category_id',
      as: 'nfts',
    });
  };

  return Category;
};
