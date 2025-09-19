import { migrate as m1 } from "./001_create_products";
import { migrate as m2 } from "./002_create_transactions";
// import { migrate as m3 } from "./003_add_transaction_status";
import { migrate as m4 } from "./004_alter_transaction_table";
import { migrate as m5 } from "./005_create_sales_log";

export const runMigrations = async () => {
  console.log("[DB] Running migrations...");
  await m1();
  await m2();
  // await m3();
  await m4();
  await m5();
  console.log("[DB] Migrations completed ✅");
};