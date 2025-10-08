CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'guest',
  image_url TEXT NOT NULL,
  email_addresses TEXT[] NOT NULL DEFAULT '{}',
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Индекс для поиска по email в массиве
CREATE INDEX IF NOT EXISTS idx_users_email_addresses ON users USING GIN (email_addresses);

CREATE INDEX IF NOT EXISTS idx_users_role ON users (ROLE);

