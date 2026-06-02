import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');
const exampleEnvPath = resolve(root, '.env.example');

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (existsSync(exampleEnvPath)) {
  dotenv.config({ path: exampleEnvPath });
}

const dbConfig: Record<string, unknown> = {
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
};

if (process.env.DB_PASSWORD) {
  dbConfig.password = process.env.DB_PASSWORD;
}

const client = new Client(dbConfig);

async function run() {
  try {
    await client.connect();
    const schemaPath = resolve(root, 'db', 'schema.sql');
    const seedPath = resolve(root, 'db', 'seed.sql');

    console.log('Applying schema from', schemaPath);
    const schema = readFileSync(schemaPath, 'utf-8');
    await client.query(schema);

    console.log('Applying seed data from', seedPath);
    const seed = readFileSync(seedPath, 'utf-8');
    await client.query(seed);

    console.log('Database schema and seed applied successfully.');
  } catch (error) {
    console.error('Failed to setup database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
