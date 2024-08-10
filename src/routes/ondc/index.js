import { Router } from "express";
import OndcApiControler from "./controller/index.js";
import RegistryController from "./controller/registory.js";
const router = Router();
import ONDCController from "../ondc-admin/controllers/ondc.controller.js";

router.post("/onboarding/on_subscribe", OndcApiControler.OnSubscribe);
router.post("/search", OndcApiControler.Search);
router.post("/subscribenewseller", RegistryController.addNewSeller);
router.post("/search", ONDCController.productSearch);


export default router;