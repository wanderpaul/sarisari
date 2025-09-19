import { Router } from "express";
import pool from "../config/db";

const router = Router();

// Save or update today's transaction
router.post("/", async (req, res) => {
  const { date, grand_total, total_profit, products } = req.body;

  if (!date || !products) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert or update transaction for today
    const txRes = await client.query(
      `INSERT INTO transactions (date, grand_total, total_profit)
       VALUES ($1, $2, $3)
       ON CONFLICT (date)
       DO UPDATE SET grand_total = EXCLUDED.grand_total,
                     total_profit = EXCLUDED.total_profit
       RETURNING id`,
      [date, grand_total, total_profit]
    );

    const transactionId = txRes.rows[0].id;

    // Clear existing items (if updating)
    await client.query(`DELETE FROM transaction_items WHERE transaction_id = $1`, [
      transactionId,
    ]);

    // Insert items
   // Insert items
for (const p of products) {
  await client.query(
    `INSERT INTO transaction_items
      (transaction_id, product_id, quantity, sold, price, profit)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      transactionId,
      p.id, // ✅ consistent
      p.quantity ?? 0,
      p.sold ?? 0,
      p.price,
      (p.price - p.original_price) * (p.sold ?? 0),
    ]
  );

  // ✅ decrement product stock
  await client.query(
    `UPDATE products
     SET quantity = quantity - $1
     WHERE id = $2`,
    [p.sold ?? 0, p.id] // ✅ use p.id here too
  );
}

    await client.query("COMMIT");
    res.json({ success: true, transactionId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to save transaction:", err);
    res.status(500).json({ error: "Failed to save transaction" });
  } finally {
    client.release();
  }
});

// Fetch today’s transaction
router.get("/today", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const { rows: transactions } = await pool.query(
      "SELECT * FROM transactions WHERE date = $1 LIMIT 1",
      [today]
    );

    if (transactions.length === 0) {
      return res.json(null); // no transaction today yet
    }

    const transaction = transactions[0];

    // ✅ Join products so we get name + original_price
    const { rows: items } = await pool.query(
      `SELECT ti.id, ti.product_id, ti.sold, ti.price, ti.profit,
              p.name, p.original_price, p.quantity
       FROM transaction_items ti
       JOIN products p ON ti.product_id = p.id
       WHERE ti.transaction_id = $1`,
      [transaction.id]
    );

    res.json({
      ...transaction,
      items,
    });
  } catch (err) {
    console.error("❌ Failed to fetch today’s transaction:", err);
    res.status(500).json({ error: "Failed to fetch today’s transaction" });
  }
});


export default router;
