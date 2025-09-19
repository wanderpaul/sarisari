import { Router } from "express";
import { createSale, listSales, getTodaySales } from "../controllers/salesController";
import pool from "../config/db";

const router = Router();

router.post("/", createSale);
router.get("/", listSales);
router.get("/today", getTodaySales);

router.post("/log", async (req, res) => {
  const { product_id, quantity, price, original_price } = req.body;

  if (!product_id || !price || !original_price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const profit = (price - original_price) * (quantity ?? 1);

    await pool.query(
      `INSERT INTO sales_log (product_id, sold_quantity, price, profit)
       VALUES ($1, $2, $3, $4)`,
      [product_id, quantity ?? 1, price, profit]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to log sale:", err);
    res.status(500).json({ error: "Failed to log sale" });
  }
});

router.get("/daily-report", async (req, res) => {
  try {
    const { date } = req.query;

    // Default to today if no date is passed
    const targetDate = date
      ? new Date(date as string).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    const query = `
       SELECT 
  DATE(s.created_at) as date,
  s.product_id,
  p.name as product_name,
  SUM(s.sold_quantity) as total_sold,
  SUM(s.profit) as total_profit,
  SUM(s.price) as total_revenue
FROM sales_log s
JOIN products p ON s.product_id = p.id
WHERE DATE(s.created_at) = $1
GROUP BY DATE(s.created_at), s.product_id, p.name
ORDER BY DATE(s.created_at) DESC, product_name;
    `;

  const totalQuery = `
     SELECT
  COALESCE(SUM(sl.price), 0) AS grand_revenue,
  COALESCE(SUM(sl.profit), 0) AS grand_profit
FROM sales_log sl
JOIN products p ON p.id = sl.product_id
WHERE DATE(sl.created_at) = $1;
    `;

    const [detailRes, totalRes] = await Promise.all([
      pool.query(query, [targetDate]),
      pool.query(totalQuery, [targetDate]),
    ]);

    res.json({
      rows: detailRes.rows,
      totals: totalRes.rows[0],
    });
  } catch (err) {
    console.error("❌ Error fetching daily report:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Revert a sale
router.post("/revert", async (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Increase back the stock
    await client.query(
      `UPDATE products
       SET quantity = quantity + $1
       WHERE id = $2`,
      [quantity, product_id]
    );

    // Fetch product info for logging
    const productRes = await client.query(
      `SELECT price, original_price FROM products WHERE id = $1`,
      [product_id]
    );
    if (productRes.rows.length === 0) {
      throw new Error("Product not found");
    }

    const { price, original_price } = productRes.rows[0];
    const profit = (price - original_price) * quantity;

    // Insert a negative log (revert entry)
    await client.query(
      `INSERT INTO sales_log (product_id, sold_quantity, profit, price, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [product_id, -quantity, -profit, -(price * quantity)]
    );

    await client.query("COMMIT");
    res.json({ success: true, message: "Sale reverted and logged" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to revert sale:", err);
    res.status(500).json({ error: "Failed to revert sale" });
  } finally {
    client.release();
  }
});


export default router;

