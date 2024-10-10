const express = require('express');
const adminRoute = express.Router();
const { userVerifyToken } = require('../../helpers/userVerifyToken');

const {getAllProduct } = require('../../controller/admin/admin.controller');


// GET ALL PRODUCT
adminRoute.get('/get-all-product', userVerifyToken , getAllProduct);

module.exports = adminRoute;

