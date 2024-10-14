const adminRoute = require('express').Router();
const userRoute = require('./admin.route');

adminRoute.use('/admin', userRoute);

module.exports = adminRoute; 