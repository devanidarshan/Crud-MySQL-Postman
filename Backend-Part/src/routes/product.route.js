const express = require('express');
const productRoute = express.Router();
const {userVerifyToken} = require('../helpers/userVerifyToken');

const {
    validateAddProduct,
    addProduct,
    validateGetAllProduct,
    getAllProduct,
    validateGetProduct,
    getProduct,
    validateUpdateProduct,
    updateProduct,
    validateDeleteProduct,
    deleteProduct,
    addProductForm,
    buyProductForm 
} = require("../controller/product.controller");

// ADD PRODUCT FORM
productRoute.get('/add-product', userVerifyToken , addProductForm);

// BUY PRODUCT FORM
productRoute.get('/buy-product', buyProductForm);

// ADD PRODUCT
productRoute.post('/add-product', userVerifyToken , validateAddProduct , addProduct);

// GET ALL PRODUCT
productRoute.get('/get-all-product', userVerifyToken , validateGetAllProduct , getAllProduct);

// GET SPECIFIC PRODUCT
productRoute.get('/get-product', userVerifyToken , validateGetProduct , getProduct);

// UPDATE PRODUCT
productRoute.put('/update-product', userVerifyToken , validateUpdateProduct , updateProduct);

// DELETE PRODUCT
productRoute.delete('/delete-product', userVerifyToken , validateDeleteProduct , deleteProduct);

module.exports = productRoute;
