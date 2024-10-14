const jwt = require('jsonwebtoken');

exports.userVerifyToken = (req, res, next) => {
    const token = req.cookies.token; 
    // const role = req.cookies.role; // Get the role from the cookie
    console.log("Token received:", token);
    // console.log("Role received:", role);
    
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied", status: 0 });
    }

    try {
        const decoded = jwt.verify(token, "User" || 'defaultSecret'); 
        req.user = decoded; // req.user
        // req.role = role; // req.role
        next();
    } catch (err) {
        console.error("Token verification error: ", err.message);
        return res.status(401).json({ msg: "Invalid token", status: 0 });
    }
};
