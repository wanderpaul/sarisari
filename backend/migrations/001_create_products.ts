// migrations/001_create_products.ts
import pool from "../src/config/db";

export const migrate = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50),
      price NUMERIC(10,2) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      original_price NUMERIC(10,2) DEFAULT 0,
      sold INT NOT NULL DEFAULT 0,
      profit NUMERIC(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
};