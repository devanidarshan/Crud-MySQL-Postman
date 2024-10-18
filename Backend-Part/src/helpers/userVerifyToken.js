const jwt = require('jsonwebtoken');

exports.userVerifyToken = (req, res, next) => {
    const token = req.cookies.token; 
    console.log("Token received:", token);
    
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied", status: 0 });
    }

    try {
        const decoded = jwt.verify(token, "User" || 'defaultSecret'); 
        req.user = decoded; // req.user
        next();
    } catch (err) {
        console.error("Token verification error: ", err.message);
        return res.status(401).json({ msg: "Invalid token", status: 0 });
    }
};
