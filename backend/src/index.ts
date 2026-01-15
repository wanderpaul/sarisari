import app from "./app";
import { initProductTable } from "./models/productModel";
import { initSalesTables } from "./models/salesModel";
import { runMigrations } from "../migrations/migrate";

runMigrations()
