// lib/user-repository.ts
import type { UserJSON } from "@clerk/nextjs/server";
import { clerkUserToDatabase, type UserDatabase } from "@/database/user";
import { query } from "./db-utils";

export class UserRepository {
  // CREATE - Создание или обновление пользователя
  async upsert(user: UserJSON, role: string): Promise<UserDatabase> {
    var dbUser = clerkUserToDatabase(user);
    dbUser.role = role;

    const result = await query<UserDatabase>(
      `
      INSERT INTO users (
        id, username, first_name, last_name, role, image_url, 
        email_addresses, last_sign_in_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        image_url = EXCLUDED.image_url,
        email_addresses = EXCLUDED.email_addresses,
        last_sign_in_at = EXCLUDED.last_sign_in_at,
        updated_at = EXCLUDED.updated_at
      RETURNING *
    `,
      [
        dbUser.id,
        dbUser.username,
        dbUser.first_name,
        dbUser.last_name,
        dbUser.role,
        dbUser.image_url,
        dbUser.email_addresses,
        dbUser.last_sign_in_at,
        dbUser.created_at,
        dbUser.updated_at,
      ],
    );

    return result.rows[0];
  }

  // READ - Получение пользователя по ID
  async findById(id: string): Promise<UserDatabase | null> {
    const result = await query<UserDatabase>(
      `
      SELECT * FROM users WHERE id = $1
    `,
      [id],
    );

    return result.rows[0] || null;
  }

  // READ - Получение пользователя по username
  async findByUsername(username: string): Promise<UserDatabase | null> {
    const result = await query<UserDatabase>(
      `
      SELECT * FROM users WHERE username = $1
    `,
      [username],
    );

    return result.rows[0] || null;
  }

  // READ - Получение пользователя по конкретному email
  async findByEmail(email: string): Promise<UserDatabase | null> {
    const result = await query<UserDatabase>(
      `
      SELECT * FROM users 
      WHERE $1 = ANY(email_addresses)
    `,
      [email],
    );

    return result.rows[0] || null;
  }

  // READ - Получение пользователей, у которых есть любой из указанных email
  async findByEmails(emails: string[]): Promise<UserDatabase[]> {
    const result = await query<UserDatabase>(
      `
      SELECT * FROM users 
      WHERE email_addresses && $1
    `,
      [emails],
    );

    return result.rows;
  }

  // READ - Получение пользователей определенной роли
  async filterByRole(role: string): Promise<UserDatabase[]> {
    const result = await query<UserDatabase>(
      `
      SELECT * FROM users 
      WHERE role = $1
    `,
      [role],
    );

    return result.rows;
  }

  // READ - Получение всех пользователей (с пагинацией)
  async findAll(
    limit: number = 50,
    offset: number = 0,
  ): Promise<UserDatabase[]> {
    const result = await query<UserDatabase>(
      `
      SELECT * FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `,
      [limit, offset],
    );

    return result.rows;
  }

  // UPDATE - Обновление отдельных полей
  async update(
    id: string,
    updates: Partial<Omit<UserDatabase, "id" | "created_at">>,
  ): Promise<UserDatabase | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.username !== undefined) {
      fields.push(`username = $${paramCount++}`);
      values.push(updates.username);
    }
    if (updates.first_name !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(updates.first_name);
    }
    if (updates.last_name !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(updates.last_name);
    }
    if (updates.role !== undefined) {
      fields.push(`role = $${paramCount++}`);
      values.push(updates.role);
    }
    if (updates.image_url !== undefined) {
      fields.push(`image_url = $${paramCount++}`);
      values.push(updates.image_url);
    }
    if (updates.email_addresses !== undefined) {
      fields.push(`email_addresses = $${paramCount++}`);
      values.push(updates.email_addresses);
    }
    if (updates.last_sign_in_at !== undefined) {
      fields.push(`last_sign_in_at = $${paramCount++}`);
      values.push(updates.last_sign_in_at);
    }

    // Всегда обновляем updated_at
    fields.push(`updated_at = $${paramCount++}`);
    values.push(new Date());

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await query<UserDatabase>(
      `
      UPDATE users 
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `,
      values,
    );

    return result.rows[0] || null;
  }

  // UPDATE - Добавление email к пользователю
  async addEmail(id: string, email: string): Promise<UserDatabase | null> {
    const result = await query<UserDatabase>(
      `
      UPDATE users 
      SET 
        email_addresses = ARRAY(SELECT DISTINCT UNNEST(email_addresses || $1::text[])),
        updated_at = $2
      WHERE id = $3
      RETURNING *
    `,
      [[email], new Date(), id],
    );

    return result.rows[0] || null;
  }

  // UPDATE - Удаление email у пользователя
  async removeEmail(id: string, email: string): Promise<UserDatabase | null> {
    const result = await query<UserDatabase>(
      `
      UPDATE users 
      SET 
        email_addresses = array_remove(email_addresses, $1),
        updated_at = $2
      WHERE id = $3
      RETURNING *
    `,
      [email, new Date(), id],
    );

    return result.rows[0] || null;
  }

  // DELETE - Удаление пользователя
  async delete(id: string): Promise<boolean> {
    const result = await query(
      `
      DELETE FROM users WHERE id = $1
    `,
      [id],
    );

    if (result.rowCount) {
      return result.rowCount > 0;
    } else {
      return false;
    }
  }

  // Поиск пользователей по имени/фамилии
  async searchByName(
    queryString: string,
    limit: number = 20,
  ): Promise<UserDatabase[]> {
    const result = await query<UserDatabase>(
      `
      SELECT * FROM users 
      WHERE 
        first_name ILIKE $1 OR 
        last_name ILIKE $1 OR
        username ILIKE $1
      ORDER BY 
        CASE 
          WHEN first_name ILIKE $1 THEN 1
          WHEN last_name ILIKE $1 THEN 2
          WHEN username ILIKE $1 THEN 3
          ELSE 4
        END
      LIMIT $2
    `,
      [`%${queryString}%`, limit],
    );

    return result.rows;
  }

  // Получение пользователей по primary email (первый email в массиве)
  async findByPrimaryEmail(email: string): Promise<UserDatabase | null> {
    const result = await query<UserDatabase>(
      `
      SELECT * FROM users 
      WHERE email_addresses[1] = $1
    `,
      [email],
    );

    return result.rows[0] || null;
  }

  // Получение статистики
  async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(last_sign_in_at) as active_users,
        AVG(
          CASE 
            WHEN last_sign_in_at IS NOT NULL THEN 
              EXTRACT(EPOCH FROM (NOW() - last_sign_in_at))
            ELSE NULL
          END
        ) as avg_seconds_since_last_sign_in
      FROM users
    `);

    return result.rows[0];
  }
}

export const userRepository = new UserRepository();
