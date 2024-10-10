const express = require('express');
const Route = express.Router();

// ADMIN ROUTE
const adminRoute = require('./admin/index.route');
Route.use('/api', adminRoute);

// SELLER ROUTE
const sellerRoute = require('./seller/index.route');
Route.use('/api', sellerRoute);

// BUYER ROUTE
const buyerRoute = require('./buyer/index.route');
Route.use('/api', buyerRoute);

// USER ROUTE
const userRoute = require('./user.route');
Route.use('/api', userRoute);

// PRODUCT ROUTE
const productRoute = require('./product.route');
Route.use('/api', productRoute);

// CART ROUTE
const cartRoute = require('./cart.route');
Route.use('/api', cartRoute);

module.exports = Route;