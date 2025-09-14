import { Request, Response } from "express";
import pool from "../config/db";
import { Product } from "../models/productModel";

// Get all products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Add product
export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, price, quantity }: Product = req.body;
    const result = await pool.query(
      "INSERT INTO products (name, category, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, category, price, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Deduct stock
export const updateQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await pool.query(
      "UPDATE products SET quantity = quantity - $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [quantity, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

