const express = require('express');
const sellerRoute = express.Router();
const { userVerifyToken } = require('../../helpers/userVerifyToken');

const {getAllProduct } = require('../../controller/seller/seller.controller');

// GET ALL PRODUCT
sellerRoute.get('/get-all-product', userVerifyToken , getAllProduct);

module.exports = sellerRoute;

