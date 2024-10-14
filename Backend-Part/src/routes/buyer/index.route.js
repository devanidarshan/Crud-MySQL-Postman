const buyerRoute = require('express').Router();
const userRoute = require('./buyer.route');

buyerRoute.use('/buyer', userRoute);

module.exports = buyerRoute;