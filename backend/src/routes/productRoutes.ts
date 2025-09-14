import { Router } from "express";
import { getProducts, addProduct, updateQuantity } from "../controllers/productController";
import pool from '../config/db';

const router = Router();
// 👉 Get all products
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 👉 Get a single product
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// 👉 Create a product
router.post('/', async (req, res) => {
  const { name, price, quantity, original_price } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products (name, price, quantity, sold, original_price)
       VALUES ($1, $2, $3, 0, $4)
       RETURNING *`,
      [name, price, quantity, original_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, original_price } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, price = $2, quantity = $3, original_price = $4 
       WHERE id = $5 
       RETURNING *`,
      [name, price, quantity, original_price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


// 👉 Deduct quantity when purchased
router.post('/:id/purchase', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // how many items bought
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be greater than 0" });
  }
  try {
    const result = await pool.query(
      'UPDATE products SET quantity = quantity - $1, updated_at = NOW() WHERE id = $2 AND quantity >= $1 RETURNING *',
      [quantity, id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Not enough stock or product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to deduct stock' });
  }
});

// 👉 Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update sold count
router.put('/:id/sell', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // how many items sold

  try {
    const result = await pool.query(
      `UPDATE products 
       SET sold = sold + $1, quantity = quantity - $1
       WHERE id = $2 AND quantity >= $1
       RETURNING *`,
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Revert a sale
router.put('/:id/revert', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // how many items to revert

  try {
    const result = await pool.query(
      `UPDATE products
       SET sold = sold - $1, quantity = quantity + $1
       WHERE id = $2 AND sold >= $1
       RETURNING *`,
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Cannot revert more than sold' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});



export default router;
