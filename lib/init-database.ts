import { migrationManager } from "./migrate";

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) return;

  try {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.RUN_MIGRATIONS_ON_START === "true"
    ) {
      console.log("🔧 Running database migrations...");
      await migrationManager.runMigrations();
    }
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}
