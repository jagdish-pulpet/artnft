
import { DataTypes, Model, Sequelize, type BuildOptions } from 'sequelize';

// Define the UserAttributes interface
export interface UserAttributes {
  user_id: string;
  username: string;
  email: string;
  password_hash: string;
  avatar_url?: string | null;
  bio?: string | null;
  wallet_address?: string | null;
  role: 'User' | 'Artist' | 'Admin';
  is_verified: boolean;
  last_login?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

// Define the UserModel interface which extends Model and UserAttributes
export interface UserModel extends Model<UserAttributes>, UserAttributes {}

// Define a class that extends Model and implements UserModel
export class User extends Model<UserModel, UserAttributes> {}

// Define the factory function for the User model
export default function (sequelize: Sequelize): typeof User {
  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      wallet_address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM('User', 'Artist', 'Admin'),
        defaultValue: 'User',
        allowNull: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // created_at and updated_at are handled by Sequelize's `timestamps: true` option in define
    },
    {
      sequelize,
      tableName: 'Users', // Explicitly set table name
      modelName: 'User',  // Model name
      timestamps: true,   // Enable timestamps
      underscored: true,  // Use snake_case for column names (created_at, updated_at)
    }
  );
  return User;
}

// Type for static model, not strictly needed for this factory pattern but good for reference
export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};
