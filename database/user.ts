import type { UserJSON } from "@clerk/nextjs/server";

// types/user.ts
export interface UserDatabase {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  image_url: string;
  email_addresses: string[]; // Просто массив email строк
  last_sign_in_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Преобразование из Clerk JSON в Database модель
export function clerkUserToDatabase(user: UserJSON): UserDatabase {
  return {
    id: user.id,
    username: user.username!,
    first_name: user.first_name!,
    last_name: user.last_name!,
    image_url: user.image_url,
    role: "guest",
    email_addresses: user.email_addresses.map((email) => email.email_address),
    last_sign_in_at: user.last_sign_in_at
      ? new Date(user.last_sign_in_at * 1000)
      : null,
    created_at: new Date(user.created_at * 1000),
    updated_at: new Date(user.updated_at * 1000),
  };
}

// Преобразование из Database модели в клиентский формат
export function databaseUserToClient(user: UserDatabase) {
  return {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    imageUrl: user.image_url,
    emailAddresses: user.email_addresses, // Уже массив строк
    lastSignInAt: user.last_sign_in_at?.toISOString(),
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
  };
}
