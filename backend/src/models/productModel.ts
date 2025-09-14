import pool from "../config/db";

export const initProductTable = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(50),
      price NUMERIC(10,2) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

export interface Product {
  id?: number;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
}

