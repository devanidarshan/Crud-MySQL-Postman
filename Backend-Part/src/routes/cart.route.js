const express = require('express');
const cartRoute = express.Router();
const { userVerifyToken } = require('../helpers/userVerifyToken');
const { addToCart , getAllCart, removeCart, getAllTotalCart } = require('../controller/cart.controller');

// ADD TO CART
cartRoute.post('/add-to-cart' , userVerifyToken , addToCart);

// GET ALL CART
cartRoute.get('/get-all-cart' , userVerifyToken , getAllCart);

// GET ALL CART
cartRoute.get('/get-all-total-cart' , userVerifyToken , getAllTotalCart);

// REMOVE CART
cartRoute.post('/remove-cart' , userVerifyToken , removeCart);

module.exports = cartRoute;
