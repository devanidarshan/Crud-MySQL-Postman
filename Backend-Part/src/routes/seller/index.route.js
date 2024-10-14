const sellerRoute = require('express').Router();
const userRoute = require('./seller.route');

sellerRoute.use('/seller', userRoute);

module.exports = sellerRoute; 