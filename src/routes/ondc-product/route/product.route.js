import { Router } from 'express';
const router = Router();
import ProductController from '../controller/productController.js';
import { middleware } from '../middleware/apiParamsValidator.js';
import { productValidateSchema } from '../validationSchema/productValidateSchema.js';
import multer from 'multer';
import { verifyToken } from '../../middleware/index.js';
const upload = multer({ dest: './uploads' });

router.post('/ProductCreate', verifyToken, middleware({ schema: productValidateSchema.create() }), ProductController.create);
router.post('/Productwithvariant', verifyToken, middleware({ schema: productValidateSchema.createWithVariant() }), ProductController.createWithVariants);
router.put('/products/:productId', verifyToken, middleware({ schema: productValidateSchema.update() }), ProductController.update);
router.put('/productWithVariant', verifyToken, middleware({ schema: productValidateSchema.updateWithVariant() }), ProductController.updateWithVariants);
router.post('/uploadBulk', verifyToken, upload.single('file'), ProductController.uploadCatalogue);
router.get('/products', verifyToken, ProductController.list);
router.get('/search', verifyToken, ProductController.search);
router.put("/productStatus", verifyToken, ProductController.productStatus);
router.get("/uploadTemplate", verifyToken, ProductController.uploadTemplate);
router.post("/product/:productId/customizations", verifyToken, middleware({ schema: productValidateSchema.createCustomization() }), ProductController.storeCustomization);

export default router;