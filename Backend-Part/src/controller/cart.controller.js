const common = require('../../common');
const mysqlConnection = require('../../connection');

// ADD TO CART
exports.addToCart = (req, res) => {
    const { productId, quantity } = req.body;
    const buyerId = req.user.userId;

    // Check if the quantity is provided
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity.' });
    }

    // Fetch the current stock quantity from the database
    const stockQuery = 'SELECT quantity FROM product WHERE id = ?';
    mysqlConnection.query(stockQuery, [productId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching product quantity.' });
        }

        const product = results[0];
        if (!product || product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock available.' });
        }

        // Proceed to add to cart and update the stock
        const addToCartQuery = 'INSERT INTO cart (productId, buyerId, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?';
        mysqlConnection.query(addToCartQuery, [productId, buyerId, quantity, quantity], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error adding item to cart.' });
            }

            // Decrease the stock quantity in the product table
            const updateStockQuery = 'UPDATE product SET quantity = quantity - ? WHERE id = ?';
            mysqlConnection.query(updateStockQuery, [quantity, productId], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error updating stock quantity.' });
                }

                res.json({ message: 'Item added to cart successfully.' });
            });
        });
    });
};

// // GET ALL CART
// exports.getAllCart = (req, res) => {
//     const sql = 'SELECT * FROM product';
//     mysqlConnection.query(sql, function (error, products) {
//         if (error) {
//             console.log(error);
//             return common.reply(res, 500, true, "Database Error...");
//         }

//         const query = 'SELECT * FROM cart';
//         mysqlConnection.query(query, (err, cartItems) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ message: 'Error fetching cart items.' });
//             }
            
//             // Pass cartItems and products to the view
//             // res.render('cart', { cartItems, products });
//             res.json({ message: "Successfully Retrieved Carts...", IsError: false, statusCode: 200, cartItems });
//         });
//     });
// };

// GET ALL CART
exports.getAllCart = (req, res) => {
    const buyerId = req.user.userId;

    // Fetch cart items along with user IDs
    const cartQuery = `
        SELECT 
            c.productId,
            c.quantity,
            p.name AS productName,
            p.price,
            u.id AS userId
        FROM 
            cart c
        JOIN 
            product p ON c.productId = p.id
        JOIN 
            user u ON c.buyerId = u.id
        WHERE 
            c.buyerId = ?;
    `;
    
    mysqlConnection.query(cartQuery, [buyerId], (err, cartItems) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching cart items.' });
        }

        // Respond with cart items including user IDs
        res.json({ message: "Successfully Retrieved Carts...", IsError: false, statusCode: 200, cartItems });
    });
};

// GET ALL TOTAL CART
exports.getAllTotalCart = (req, res) => {

    const cartQuery = `
        SELECT 
            c.productId,
            c.quantity,
            p.name AS productName,
            p.price,
            u.id AS userId
        FROM 
            cart c
        JOIN 
            product p ON c.productId = p.id
        JOIN 
            user u ON c.buyerId = u.id
    `;
    
    mysqlConnection.query(cartQuery, (err, cartItems) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching cart items.' });
        }

        // Respond with cart items including user IDs
        res.json({ message: "Successfully Retrieved Carts...", IsError: false, statusCode: 200, cartItems });
    });
};

// REMOVE CART
exports.removeCart = (req, res) => {
    const { productId } = req.body;
    const buyerId = req.user.userId; 
    console.log(buyerId);

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    // Step 1: Fetch the quantity of the product in the cart
    const fetchQuery = 'SELECT quantity FROM cart WHERE productId = ? AND buyerId = ?';
    mysqlConnection.query(fetchQuery, [productId, buyerId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching item quantity from cart.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No item found in cart to remove.' });
        }

        const cartItem = results[0];
        const quantityToRestore = cartItem.quantity; // Quantity to restore

        // Step 2: Remove the item from the cart
        const deleteQuery = 'DELETE FROM cart WHERE productId = ? AND buyerId = ?';
        mysqlConnection.query(deleteQuery, [productId, buyerId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error removing item from cart.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No item found to remove.' });
            }

            // Step 3: Restore the quantity in the products table
            const updateStockQuery = 'UPDATE product SET quantity = quantity + ? WHERE id = ?';
            mysqlConnection.query(updateStockQuery, [quantityToRestore, productId], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error restoring item quantity in database.' });
                }

                // Fetch the updated cart items
                mysqlConnection.query('SELECT * FROM cart WHERE buyerId = ?', [buyerId], (err, cartItems) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error fetching cart items.' });
                    }
                    res.json({ message: 'Item removed from cart successfully.', cartItems }); 
                });
            });
        });
    });
};





