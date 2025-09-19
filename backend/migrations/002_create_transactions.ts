// migrations/001_create_products.ts
import pool from "../src/config/db";

export const migrate = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    grand_total NUMERIC(10,2) NOT NULL,
    total_profit NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    sold INT NOT NULL
    );

     DO $$
        BEGIN
            IF NOT EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'unique_transaction_date'
            ) THEN
            ALTER TABLE transactions
            ADD CONSTRAINT unique_transaction_date UNIQUE (date);
            END IF;
        END
        $$;
  `);
};