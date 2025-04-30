import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT || 'postgres',
  username: process.env.DATABASE_USERNAME,
  password: String(process.env.DATABASE_PASSWORD),
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  dialectOptions:
    process.env.DATABASE_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : undefined,
});

try {
  await sequelize.authenticate();
  console.log('Database connection successful');
} catch (error) {
  console.error(`Error connection to database: ${error}`);
  process.exit(1);
}

export default sequelize;
