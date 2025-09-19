// migrations/001_create_products.ts
import pool from "../src/config/db";

export const migrate = async () => {
  await pool.query(`
  ALTER TABLE transaction_items
ADD COLUMN IF NOT EXISTS quantity INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS profit NUMERIC(10,2) NOT NULL DEFAULT 0;

ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft'
  `);
};