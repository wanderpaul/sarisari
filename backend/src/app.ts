import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import salesRoutes from "./routes/salesRoutes";
import transactionRoutes from "./routes/transactionRoute";
import pool from './config/db';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/sales", salesRoutes);
app.use("/transactions", transactionRoutes);
app.get("/", (req, res) => {
  res.send("Sari-Sari Store API running with TypeScript 🚀");
});

// DB test route
app.get('/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

export default app;

