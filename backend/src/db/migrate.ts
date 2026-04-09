import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
  override: false,
});

export async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const migrationClient = new Pool({ connectionString, max: 1 });
  const db = drizzle(migrationClient);

  try {
    const migrationsFolder = path.join(process.cwd(), 'drizzle');

    await migrate(db, { migrationsFolder, migrationsSchema: 'public' });

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migrations failed:', error);
    throw error;
  } finally {
    await migrationClient.end();
  }
}

if (require.main === module) {
  runMigrations().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
