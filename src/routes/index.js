import { Router } from "express";
const router = Router();

import ondcRouter from "./ondc/index.js";
import productRouter from "./ondc-product/route/product.route.js";
import dashboardRouter from "./admin/index.js"
import healthRouter from "./health/index.js"
router.use("/ondc", ondcRouter);
router.use("/product", productRouter);
router.use("/dashboard", dashboardRouter);
router.use("/server", healthRouter);



export default router;