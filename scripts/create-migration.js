import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

function createMigration(name) {
	const timestamp = new Date()
		.toISOString()
		.replace(/[^0-9]/g, "")
		.slice(0, 14);
	const filename = `${timestamp}_${name}.sql`;
	const filepath = join(__dirname, "..", "migrations", filename);

	// Создаем директорию migrations если её нет
	const migrationsDir = dirname(filepath);
	if (!existsSync(migrationsDir)) {
		mkdirSync(migrationsDir, { recursive: true });
	}

	// Создаем пустой файл миграции
	writeFileSync(
		filepath,
		`-- Migration: ${name}\n-- Created at: ${new Date().toISOString()}\n\n`,
	);

	console.log(`✅ Created migration: ${filename}`);
	return filename;
}

// Получаем имя миграции из аргументов
const migrationName = process.argv[2];
if (!migrationName) {
	console.error(
		"Please provide a migration name: npm run migrate:create <name>",
	);
	process.exit(1);
}

createMigration(migrationName);
