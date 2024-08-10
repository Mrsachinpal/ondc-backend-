import { Router } from "express";
import UserAdminController from './controller/index.js';
import verifyToken from './middleware/index.js';

const router = Router();
///SWS Main Access
router.post("/login", UserAdminController.login);
router.post("/register", UserAdminController.register);
router.post("/User/OrgAccControl", UserAdminController.OrgAccControl);

///Seller Dashboard APIs
router.post("/adminRegister", UserAdminController.adminRegister);
router.post("/adminStoreDetails",UserAdminController.adminStoreDetail);
router.post("/adminLogin", UserAdminController.adminLogin);
router.post("/addStaff", UserAdminController.addStaff);
router.get("/sellerList", UserAdminController.sellerList);
router.get("/staffList/:id", UserAdminController.staffList);
router.put("/staffaccessControl", UserAdminController.staffaccessControl);
router.put("/sellerUpdate", UserAdminController.sellerUpdate);
router.post("/logout", UserAdminController.logout);
 
export default router;