const mysqlConnection = require('../../../connection');
const common = require('../../../common');

// GET ALL PRODUCT
exports.getAllProduct = (req, res) => {
    const userId = req.user.userId; 
    const userRole = req.user.role; 
    const userEmail = req.user.email; // User email ko access karen

    let sql;
    if (userRole === 'seller') {
        // If user is admin, fetch all products
        sql = 'SELECT * FROM product';
    } else {
        // If user is not admin, fetch only their products
        sql = 'SELECT * FROM product WHERE userId = ?';
    }

    mysqlConnection.query(sql, userRole === 'seller' ? [] : [userId], (error, results) => {
        if (error) {
            console.error(error);
            return common.reply(res, 500, true, 'Error retrieving products...');
        }

        // Render the products in your EJS template
        res.render('seller/productList', { products: results, email: userEmail });
    });
};
