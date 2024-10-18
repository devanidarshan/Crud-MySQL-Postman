module.exports = {
    reply: async function (res, errorcode, isError, message, data) {
        return res.status(200).json({
            msg: message,
            error: isError,
            statusCode: errorcode,
            data: data
        });
    }
};

module.exports = {
    cookie: async function (req, res, next) {
        console.log('Cookies:', req.cookies);
        res.locals.role = req.cookies.role || null;
        res.locals.email = req.cookies.email || null;
        next();
    }
};



