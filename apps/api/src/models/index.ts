
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserFactory from './User'; // Import the User model factory

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const env = process.env.NODE_ENV || 'development';

// Ensure required environment variables are set for the current environment
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const dbDialect = process.env.DB_DIALECT as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' || 'mysql';

if (!dbName || !dbUser || !dbHost || dbPassword === undefined) { // dbPassword can be an empty string
  console.error('Database configuration error: Missing one or more required environment variables (DB_NAME, DB_USER, DB_HOST, DB_PASSWORD).');
  process.exit(1);
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: env === 'development' ? console.log : false, // Log SQL queries in development
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true, // Sequelize will manage createdAt and updatedAt fields
    underscored: true, // Use snake_case for automatically generated attributes like foreign keys
  },
});

const db: { [key: string]: any } = {};

db.User = UserFactory(sequelize);
// Add other models here
// e.g., db.NFT = NFTFactory(sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
