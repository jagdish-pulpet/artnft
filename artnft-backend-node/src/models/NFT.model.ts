
// src/models/NFT.model.ts
import { DataTypes, Model, type Sequelize, type ModelCtor, type Optional, type BelongsToGetAssociationMixin } from 'sequelize';
import type { UserInstance } from './User.model';
import type { CategoryInstance } from './Category.model';


export type NftStatusType = 'pending_moderation' | 'listed' | 'on_auction' | 'sold' | 'hidden' | 'draft';

export interface NFTAttributes {
  id?: string; // UUID
  title: string;
  description?: string | null;
  image_url: string;
  price_eth?: number | null; // Using number for DECIMAl
  currency_symbol?: string;
  status?: NftStatusType;
  is_auction?: boolean;
  auction_ends_at?: Date | null;
  creator_id: string; // Foreign Key to Users table (UUID)
  owner_id?: string | null; // Foreign Key to Users table (UUID)
  category_id?: number | null; // Foreign Key to Categories table (INTEGER)
  collection_id?: number | null; // Foreign Key to Collections table (INTEGER)
  tags?: string[] | null; // JSONB in DB, array of strings in JS/TS
  metadata_url?: string | null;
  royalty_percentage?: number; // Using number for DECIMAL
  unlockable_content?: string | null;
  view_count?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NFTInstance extends Model<NFTAttributes, Optional<NFTAttributes, 'id' | 'currency_symbol' | 'status' | 'is_auction' | 'view_count' | 'createdAt' | 'updatedAt'>>, NFTAttributes {
    // Define associations here
    getCreator: BelongsToGetAssociationMixin<UserInstance>;
    getOwner: BelongsToGetAssociationMixin<UserInstance>;
    getCategory: BelongsToGetAssociationMixin<CategoryInstance>;
    // getCollection: BelongsToGetAssociationMixin<CollectionInstance>; // If Collection model exists
    // getBids: HasManyGetAssociationsMixin<BidInstance>; // If Bid model exists
}

export default function initNFTModel(sequelize: Sequelize): ModelCtor<NFTInstance> {
  const NFT = sequelize.define<NFTInstance>('NFT', {
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
    creator_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    collection_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB, 
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

  (NFT as any).associate = (models: any) => {
    NFT.belongsTo(models.User, { 
        foreignKey: 'creator_id', 
        as: 'creator',
        onDelete: 'RESTRICT', // Prevent user deletion if they created NFTs
        onUpdate: 'CASCADE'
    });
    NFT.belongsTo(models.User, { 
        foreignKey: 'owner_id', 
        as: 'owner',
        onDelete: 'SET NULL', // If owner deleted, NFT owner_id becomes NULL
        onUpdate: 'CASCADE'
    });
    NFT.belongsTo(models.Category, { 
        foreignKey: 'category_id', 
        as: 'category',
        onDelete: 'SET NULL', // If category deleted, NFT category_id becomes NULL
        onUpdate: 'CASCADE'
    });
    // Example: NFT.belongsTo(models.Collection, { foreignKey: 'collection_id', as: 'collection' });
    // Example: NFT.hasMany(models.Bid, { foreignKey: 'nft_id', as: 'bids' });
  };

  return NFT;
};
