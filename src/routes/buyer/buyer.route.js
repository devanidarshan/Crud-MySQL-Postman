const express = require('express');
const buyerRoute = express.Router();
const { userVerifyToken } = require('../../helpers/userVerifyToken');
const { getAllProduct } = require('../../controller/buyer/buyer.controller');

// GET ALL PRODUCT
buyerRoute.get('/get-all-product', userVerifyToken, getAllProduct);


module.exports = buyerRoute;
