import pool from "../config/db";

export const initSalesTables = async (): Promise<void> => {
  // create sales related tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      total_amount NUMERIC(14,2) NOT NULL,
      payment_method VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sale_lines (
      id SERIAL PRIMARY KEY,
      sale_id INT REFERENCES sales(id) ON DELETE CASCADE,
      product_id INT REFERENCES products(id),
      quantity INT NOT NULL,
      unit_price NUMERIC(10,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inventory_transactions (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES products(id),
      change_qty INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      reference_id INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

