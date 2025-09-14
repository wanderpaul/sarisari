import { Router } from "express";
import { createSale, listSales, getTodaySales } from "../controllers/salesController";

const router = Router();

router.post("/", createSale);
router.get("/", listSales);
router.get("/today", getTodaySales);

export default router;

