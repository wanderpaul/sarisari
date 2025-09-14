import app from "./app";
import { initProductTable } from "./models/productModel";
import { initSalesTables } from "./models/salesModel";
import { runMigrations } from "../migrations/migrate";

const PORT = process.env.PORT || 5000;

runMigrations()
  .then(() => {
    app.listen(5000, () => {
      console.log("🚀 Backend running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
