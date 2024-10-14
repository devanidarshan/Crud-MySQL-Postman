const mysqlConnection = require('../../../connection');
const common = require('../../../common');

// GET ALL PRODUCT
exports.getAllProduct = (req, res) => {
    const userId = req.user.userId; 
    const userRole = req.user.role; 

    let sql;
    if (userRole === 'buyer') {
        // Fetch all products for buyers
        sql = 'SELECT * FROM product';
    } else {
        // Fetch only their products for non-buyers
        sql = 'SELECT * FROM product WHERE userId = ?';
    }

    mysqlConnection.query(sql, userRole === 'buyer' ? [] : [userId], (error, results) => {
        if (error) {
            console.error(error);
            return common.reply(res, 500, true, 'Error retrieving products...');
        }

        // Render the products in your EJS template
        res.render('buyer/productList', { products: results });
    });
};

