import { Router } from "express";
import HealthController from './controller/index.js';

const router = Router();
router.post("/health", HealthController.health);
export default router;