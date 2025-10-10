import fs from "node:fs";
import path from "node:path";
import { query } from "./db-utils";

export interface Migration {
	id: number;
	name: string;
	executed_at: Date;
}

export class MigrationManager {
	private migrationsPath: string;

	constructor() {
		this.migrationsPath = path.join(process.cwd(), "migrations");
	}

	async init() {
		try {
			await query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
			console.log("Migrations table initialized");
		} catch (error) {
			console.error("Failed to initialize migrations table:", error);
			throw error;
		}
	}

	async getExecutedMigrations(): Promise<Migration[]> {
		try {
			const result = await query<Migration>(
				"SELECT * FROM migrations ORDER BY id",
			);
			return result.rows;
		} catch (error) {
			if ((error as { code?: string }).code === "42P01") {
				return [];
			}
			throw error;
		}
	}

	getMigrationFiles(): string[] {
		try {
			const files = fs.readdirSync(this.migrationsPath);
			return files.filter((file) => file.endsWith(".sql")).sort();
		} catch (error) {
			console.error("Failed to read migrations directory:", error);
			return [];
		}
	}

	async executeMigration(filename: string): Promise<void> {
		const filePath = path.join(this.migrationsPath, filename);
		const sql = fs.readFileSync(filePath, "utf8");

		try {
			await query("BEGIN");

			await query(sql);

			await query("INSERT INTO migrations (name) VALUES ($1)", [filename]);

			await query("COMMIT");
			console.log(`✅ Migration executed: ${filename}`);
		} catch (error) {
			await query("ROLLBACK");
			console.error(`❌ Failed to execute migration: ${filename}`, error);
			throw error;
		}
	}

	async runMigrations(): Promise<void> {
		try {
			await this.init();

			const executedMigrations = await this.getExecutedMigrations();
			const executedNames = new Set(executedMigrations.map((m) => m.name));

			const migrationFiles = this.getMigrationFiles();
			const pendingMigrations = migrationFiles.filter(
				(file) => !executedNames.has(file),
			);

			if (pendingMigrations.length === 0) {
				console.log("✅ No pending migrations");
				return;
			}

			console.log(`📋 Found ${pendingMigrations.length} pending migrations`);

			for (const migrationFile of pendingMigrations) {
				console.log(`🚀 Executing: ${migrationFile}`);
				await this.executeMigration(migrationFile);
			}

			console.log("✅ All migrations completed successfully");
		} catch (error) {
			console.error("❌ Migration failed:", error);
			throw error;
		}
	}

	async rollbackMigration(filename: string): Promise<void> {
		try {
			await query("DELETE FROM migrations WHERE name = $1", [filename]);
			console.log(`↩️  Migration marked as rolled back: ${filename}`);
		} catch (error) {
			console.error(`Failed to rollback migration: ${filename}`, error);
			throw error;
		}
	}
}

export const migrationManager = new MigrationManager();
