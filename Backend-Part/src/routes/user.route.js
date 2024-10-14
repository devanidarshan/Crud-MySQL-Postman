const express = require('express');
const userRoute = express.Router();
const { userVerifyToken } = require('../helpers/userVerifyToken');
const upload = require('../../multer');

const {
    registerUser,
    validateRegisterUser,
    loginUser,
    validateLoginUser,
    getAllUser,
    getUser,
    validateGetUser,
    updateUser,
    validateUpdateUser,
    deleteUser,
    validateDeleteUser,
    updatePassword,
    validateUpdatePassword,
    uploadProfile,
    validateUploadProfile,
    signOut
} = require('../controller/user.controller');

// REGISTER USER ROLE
userRoute.get('/register-user', (req, res) => {
    const role = res.locals.role;
    res.render('registeruser', { role }); 
});

// LOGIN USER ROLE
userRoute.get('/login-user', (req, res) => {
    const role = res.locals.role;    
    res.render('loginuser', { role }); 
});

// REGISTER USER
userRoute.post('/register-user', validateRegisterUser , registerUser);

// LOGIN USER
userRoute.post('/login-user', validateLoginUser ,loginUser);

// GET ALL USER
userRoute.get('/get-all-user', userVerifyToken , getAllUser);

// GET SPECIFIC USER
userRoute.get('/get-specific-user' , userVerifyToken , validateGetUser ,getUser);

// UPDATE USER
userRoute.put('/update-user', userVerifyToken , validateUpdateUser ,updateUser);

// DELETE USER
userRoute.delete('/delete-user', userVerifyToken , validateDeleteUser ,deleteUser);

// UPDATE PASSWORD
userRoute.put('/update-password', userVerifyToken , validateUpdatePassword ,updatePassword);

// UPLOAD PROFILE
userRoute.post('/upload-profile', upload , userVerifyToken ,validateUploadProfile ,uploadProfile);

// SIGN-OUT USER
userRoute.get('/signout-user', userVerifyToken , signOut);

module.exports = userRoute;