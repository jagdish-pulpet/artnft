
// src/models/Category.model.ts
import { DataTypes, Model, type Sequelize, type ModelCtor, type Optional } from 'sequelize';
// Import NFTInstance if association is defined here
// import type { NFTInstance } from './NFT.model'; 

export interface CategoryAttributes {
  id?: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryInstance extends Model<CategoryAttributes, Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'>>, CategoryAttributes {
  // Define associations here, e.g.
  // getNfts: HasManyGetAssociationsMixin<NFTInstance>;
}

export default (sequelize: Sequelize): ModelCtor<CategoryInstance> => {
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

  // Category.associate = (models) => {
  //   Category.hasMany(models.NFT, {
  //     foreignKey: 'category_id',
  //     as: 'nfts',
  //   });
  // };

  return Category;
};
