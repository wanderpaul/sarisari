import { Request, Response } from "express";
import pool from "../config/db";

/**
 * Create a sale (transactional):
 * body: { items: [{ product_id, quantity, unit_price }], payment_method? }
 */
export const createSale = async (req: Request, res: Response) => {
  const { items, payment_method } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "No items provided" });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // compute total
    let total = 0;
    for (const it of items) {
      total += Number(it.unit_price) * Number(it.quantity);
    }

    const saleInsert = await client.query(
      `INSERT INTO sales (total_amount, payment_method) VALUES ($1, $2) RETURNING *`,
      [total, payment_method ?? "cash"]
    );
    const sale = saleInsert.rows[0];

    for (const it of items) {
      const { product_id, quantity, unit_price } = it;

      // lock product row to avoid race conditions
      const prodRes = await client.query(
        `SELECT quantity FROM products WHERE id = $1 FOR UPDATE`,
        [product_id]
      );
      if (prodRes.rows.length === 0) {
        throw new Error(`Product ${product_id} not found`);
      }
      const currentQty = prodRes.rows[0].quantity;
      if (currentQty < quantity) {
        throw new Error(`Insufficient stock for product ${product_id}`);
      }

      // insert sale line
      await client.query(
        `INSERT INTO sale_lines (sale_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
        [sale.id, product_id, quantity, unit_price]
      );

      // update product quantity
      await client.query(
        `UPDATE products SET quantity = quantity - $1, updated_at = NOW() WHERE id = $2`,
        [quantity, product_id]
      );

      // record inventory transaction
      await client.query(
        `INSERT INTO inventory_transactions (product_id, change_qty, type, reference_id) VALUES ($1, $2, $3, $4)`,
        [product_id, -quantity, "sale", sale.id]
      );
    }

    await client.query("COMMIT");

    // return sale with items
    const saleWithItems = await pool.query(
      `SELECT s.id, s.total_amount, s.payment_method, s.created_at,
              json_agg(json_build_object('product_id', sl.product_id, 'quantity', sl.quantity, 'unit_price', sl.unit_price)) AS items
       FROM sales s
       JOIN sale_lines sl ON sl.sale_id = s.id
       WHERE s.id = $1
       GROUP BY s.id`,
      [sale.id]
    );

    res.status(201).json(saleWithItems.rows[0]);
  } catch (err: any) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: err.message ?? "Failed to create sale" });
  } finally {
    client.release();
  }
};

/** List all sales (with lines) */
export const listSales = async (req: Request, res: Response) => {
  try {
    const r = await pool.query(
      `SELECT s.id, s.total_amount, s.payment_method, s.created_at,
              json_agg(json_build_object('product_id', sl.product_id, 'quantity', sl.quantity, 'unit_price', sl.unit_price)) AS items
       FROM sales s
       JOIN sale_lines sl ON sl.sale_id = s.id
       GROUP BY s.id
       ORDER BY s.created_at DESC`
    );
    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/** Today's sales summary */
export const getTodaySales = async (req: Request, res: Response) => {
  try {
    const r = await pool.query(
      `SELECT COALESCE(SUM(s.total_amount),0) AS total_sales,
              COALESCE(SUM(sl.quantity),0) AS total_items_sold,
              COALESCE(COUNT(DISTINCT s.id),0) AS transactions
       FROM sales s
       LEFT JOIN sale_lines sl ON sl.sale_id = s.id
       WHERE s.created_at::date = CURRENT_DATE`
    );
    res.json(r.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

