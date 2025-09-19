// migrations/005_create_sales_log.ts
import pool from "../src/config/db";

export const migrate = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales_log (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      sold_quantity INT NOT NULL DEFAULT 1,
      price NUMERIC(10,2) NOT NULL,
      profit NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};
