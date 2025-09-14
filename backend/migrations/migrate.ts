import { migrate as m1 } from "./001_create_products";

export const runMigrations = async () => {
  console.log("[DB] Running migrations...");
  await m1();
  console.log("[DB] Migrations completed ✅");
};