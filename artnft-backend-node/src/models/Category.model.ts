
// src/models/Category.model.ts
import { DataTypes, Model, type Sequelize, type ModelCtor, type Optional, type HasManyGetAssociationsMixin } from 'sequelize';
import type { NFTInstance } from './NFT.model'; 

export interface CategoryAttributes {
  id?: number; // SERIAL PK
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryInstance extends Model<CategoryAttributes, Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'>>, CategoryAttributes {
  // Define associations here
  getNfts: HasManyGetAssociationsMixin<NFTInstance>;
}

// Renamed the function to avoid conflict with the model name
export default function initCategoryModel(sequelize: Sequelize): ModelCtor<CategoryInstance> {
  const Category = sequelize.define<CategoryInstance>('Category', {
    id: {
      type: DataTypes.INTEGER,
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
        beforeValidate: (category: CategoryInstance) => {
            if (category.name && !category.slug) {
                category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            }
        }
    }
  });

  (Category as any).associate = (models: any) => {
    Category.hasMany(models.NFT, {
      foreignKey: 'category_id',
      as: 'nfts',
      onDelete: 'SET NULL', // If a category is deleted, NFTs in it will have category_id set to NULL
      onUpdate: 'CASCADE'
    });
  };

  return Category;
};
