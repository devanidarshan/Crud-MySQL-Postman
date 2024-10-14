const express = require('express');
const cartRoute = express.Router();
const { userVerifyToken } = require('../helpers/userVerifyToken');
const { addToCart , getAllCart, removeCart } = require('../controller/cart.controller');

// ADD TO CART
cartRoute.post('/add-to-cart' , addToCart);

// GET ALL CART
cartRoute.get('/get-all-cart' , getAllCart);

// REMOVE CART
cartRoute.post('/remove-cart' , removeCart);

module.exports = cartRoute;
