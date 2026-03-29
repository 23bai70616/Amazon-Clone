import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const createDB = async () => {
  const client = new Client({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    password: process.env.PG_PASSWORD || 'Adarsh@21',
    port: process.env.PG_PORT || 5432,
    database: 'postgres', // Connect to default DB first
  });

  try {
    await client.connect();
    console.log('Connected to default database...');

    const dbName = process.env.PG_DATABASE || 'amazon_clone';

    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    if (res.rowCount === 0) {
      console.log(`Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log('Database created successfully.');
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error creating database:', err);
    await client.end();
    process.exit(1);
  }
};

createDB();
