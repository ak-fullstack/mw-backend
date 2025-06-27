import { AppDataSource } from "./data-source";

async function runMigrations() {
  try {
    console.log('📦 Initializing database connection...');
    const dataSource = await AppDataSource.initialize();

    console.log('🚀 Running pending migrations...');
    await dataSource.runMigrations();

    console.log('✅ Migrations completed successfully.');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();