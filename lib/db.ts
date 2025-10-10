import { Pool, type PoolConfig } from "pg";

// Определяем окружение
const isVercel = !!process.env.VERCEL;
// const isProduction = process.env.NODE_ENV === "production";

const getPoolConfig = (): PoolConfig => {
	// Production на Vercel
	if (isVercel && process.env.POSTGRES_URL) {
		return {
			connectionString: process.env.POSTGRES_URL,
			max: 5,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 10000,
			ssl: { rejectUnauthorized: false },
		};
	}

	// Локальная разработка или тестирование
	return {
		connectionString: process.env.POSTGRES_URL,
		ssl: false,
	};
};

const pool = new Pool(getPoolConfig());

export { pool };
