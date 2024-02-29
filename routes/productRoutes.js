import express from 'express';
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductPhotoController, filterProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable'

const router=express.Router();

router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);
router.get('/get-product',getProductController);
router.get('/get-product/:slug',getSingleProductController);
router.get('/product-photo/:pid',productPhotoController);
router.delete('/delete-product/:pid',requireSignIn,isAdmin,deleteProductPhotoController);
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);
router.post('/filter-product',filterProductController);
router.get('/product-count',productCountController);
router.get('/product-list/:page',productListController);
router.get('/search/:keyword',searchProductController);
router.get('/related-product/:pid/:cid',relatedProductController);
router.get('/product-category/:slug',productCategoryController);
router.get('/braintree/token',braintreeTokenController);
router.post('/braintree/payment',requireSignIn,braintreePaymentController);

export default router;