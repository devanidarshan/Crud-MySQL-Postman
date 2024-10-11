const common = require('../../common');
const mysqlConnection = require('../../connection');

// ADD TO CART
exports.addToCart = (req, res) => {
    const { productId, quantity } = req.body;
    const buyerId = req.query.id;
    // console.log(buyerId);

    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required.' });
    }


    const insertQuery = 'INSERT INTO cart (productId, quantity, buyerId) VALUES (?, ?, ?)';
    mysqlConnection.query(insertQuery, [productId, quantity, buyerId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error adding to cart.' });
        }

        // Fetch the updated cart items
        const fetchQuery = 'SELECT * FROM cart WHERE buyerId = ?';
        mysqlConnection.query(fetchQuery, [buyerId], (err, cartItems) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error fetching cart items.' });
            }
            res.redirect("/api/get-all-cart");            
        });
    });
};

// GET ALL CART
exports.getAllCart = (req, res) => {
    const sql = 'SELECT * FROM product';
    mysqlConnection.query(sql, function (error, products) {
        if (error) {
            console.log(error);
            return common.reply(res, 500, true, "Database Error...");
        }

        const query = 'SELECT * FROM cart';
        mysqlConnection.query(query, (err, cartItems) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error fetching cart items.' });
            }
            
            // Pass cartItems and products to the view
            res.render('cart', { cartItems, products });
        });
    });
};


// REMOVE CART
exports.removeCart = (req , res) => {
    const itemId = req.body.id;

    if (!itemId) {
        return res.status(400).send('Item ID is required.');
    }
    const query = 'DELETE FROM cart WHERE id = ?';
    mysqlConnection.query(query, [itemId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error removing item from cart.');
        }
        res.redirect('back'); 
    });
};

