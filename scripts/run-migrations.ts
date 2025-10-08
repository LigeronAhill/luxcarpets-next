import { migrationManager } from "../lib/migrate";

async function main() {
  try {
    console.log("🚀 Starting database migrations...");
    await migrationManager.runMigrations();
    console.log("🎉 Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Migrations failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
