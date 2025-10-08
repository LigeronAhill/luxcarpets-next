import type { QueryResult, QueryResultRow } from "pg";
import { pool } from "./db";

export interface QueryParams {
  text: string;
  values?: any[];
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[],
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(text, params);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function transaction<T extends QueryResultRow = any>(
  queries: QueryParams[],
): Promise<QueryResult<T>[]> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const results: QueryResult<T>[] = [];
    for (const { text, values } of queries) {
      const result = await client.query<T>(text, values);
      results.push(result);
    }

    await client.query("COMMIT");
    return results;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction error:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function findOne<T extends QueryResultRow = any>(
  table: string,
  where: Record<string, any>,
): Promise<T | null> {
  const keys = Object.keys(where);
  const values = Object.values(where);
  const whereClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(" AND ");

  const result = await query<T>(
    `SELECT * FROM ${table} WHERE ${whereClause} LIMIT 1`,
    values,
  );

  return result.rows[0] || null;
}

export async function insert<T extends QueryResultRow = any>(
  table: string,
  data: Record<string, any>,
  returning = "id",
): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

  const result = await query<T>(
    `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING ${returning}`,
    values,
  );

  return result.rows[0];
}
