const mysqlConnection = require('../../connection');
const { body, query , validationResult } = require('express-validator');
const common = require('../../common');

// Validation Middleware
exports.validateAddProduct = [
    body('name').notEmpty().withMessage('Product name is required.'),
    body('price')
      .isFloat({ gt: 0 }).withMessage('Price must be a positive number.'),
    body('quantity')
      .isInt({ gt: 0 }).withMessage('Quantity must be a positive integer.'),
    body('description')
      .optional()
      .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters.')
  ];

// Serve the add product form
exports.addProductForm = (req, res) => {
    res.render('addproduct'); // Ensure 'addproduct.ejs' 
};

// Serve the buy product form
exports.buyProductForm = (req, res) => {
    const sql = 'SELECT * FROM product'; // Fetch all products

    mysqlConnection.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error retrieving products.' });
        }

        // Render the buyproduct EJS template and pass products
        res.render('buyer/buyproduct', { products: results }); // Pass products to the view
    });
};


// // ADD PRODUCT
// exports.addProduct = async (req, res) => {
//   // Validate inputs
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//       return common.reply(res, 400, true, 'Validation failed.');
//   }

//   // const userId = req.user.userId;
//   // console.log(userId);
  
//   const { name, description, price, quantity} = req.body;
// // console.log(req.body.name , req.body.description , req.body.price , req.body.quantity);

//   if (!name || !description || !price || !quantity) {
//       // return common.reply(res, 400, true, 'All product fields are required.');
//       res.json({message:"Product Field Are Required."});
//   }
  
//  try {
//       // Prepare new product data
//       const newProduct = {
//           name,
//           description,
//           price,
//           quantity,
//           // userId
//       };
//       console.log(newProduct);

//       // SQL Query to insert product into the database
//       const sql = 'INSERT INTO product (name, description, price, quantity , userId) VALUES (?, ?, ?, ?,?)';
//       mysqlConnection.query(sql, [newProduct.name, newProduct.description, newProduct.price, newProduct.quantity ], (error, results) => {
//           if (error) {
//               console.error(error);
//               // return common.reply(res, 500, true, 'Error adding product...');
//           }

//           // Response after successful product insertion
//           const data = {
//               product: {
//                   // id: results.insertId,
//                   name: newProduct.name,
//                   description: newProduct.description,
//                   price: newProduct.price,
//                   quantity: newProduct.quantity,
//                   // userId: newProduct.userId
//               },
//           };
//           // return common.reply(res, 201, false, 'Product added successfully.', data);
//           res.redirect('/api/get-all-product');
//       });
//   } catch (error) {
//       console.error(error);
//       // return common.reply(res, 500, true, 'Internal Server Error...');
//       res.json({message:"Internal Server Error..."});
//   }
// };

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed.' });
  }

  const { name, description, price, quantity } = req.body;

  // Validate required fields
  if (!name || !description || !price || !quantity) {
      return res.status(400).json({ message: "All product fields are required." });
  }

  try {
      // Prepare new product data
      const newProduct = { name, description, price, quantity };
      console.log(newProduct);

      // SQL Query to insert product into the database
      const sql = 'INSERT INTO product (name, description, price, quantity) VALUES (?, ?, ?, ?)';
      mysqlConnection.query(sql, [newProduct.name, newProduct.description, newProduct.price, newProduct.quantity], (error, results) => {
          if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Error adding product.' });
          }

          const data = {
              product: {
                  id: results.insertId,
                  name: newProduct.name,
                  description: newProduct.description,
                  price: newProduct.price,
                  quantity: newProduct.quantity,
              },
          };
          res.status(201).json({ success: true, message: 'Product added successfully.', data });
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error..." });
  }
};



  // Validation Middleware
exports.validateGetAllProduct = [
    query('productId')
      .isInt().withMessage('Product ID must be an integer.')
      .notEmpty().withMessage('Product ID is required.'),
  ];
  
  // GET ALL PRODUCT
exports.getAllProduct = async (req, res) => {
    // // Validate inputs
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return common.reply(res ,400 , true ,'Validation failed.');
    // }

    try {
      const getAllProductsQuery = 'SELECT * FROM product'; 
      mysqlConnection.query(getAllProductsQuery, (error, results) => {
        if (error) {
          console.error(error);
          return common.reply(res, 500, true, 'Internal Server Error...');
        }
  
        if (results.length === 0) {
          return common.reply(res, 404, true, 'No products found...');
        }
  
        // RESPOND
        const data = results;
        console.log(results);
        
        res.json({message: 'Products retrieved successfully...', data});
        // (e.g., allproduct.ejs)
        //  res.render('allproduct', { products: results });
      });
  
    } catch (error) {
      console.log(error);
      return common.reply(res, 500, true, 'Internal Server Error...');
    }
  };

  // Validation Middleware
exports.validateGetProduct = [
    query('productId')
      .isInt().withMessage('Product ID must be an integer.')
      .notEmpty().withMessage('Product ID is required.'),
  ];

  // GET SPECIFIC PRODUCT
exports.getProduct = async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return common.reply(res, 400, true, 'Validation failed.');
    }

    try {
        const productId = req.query.productId;

        // Query to find the product by ID
        const queryGetProduct = 'SELECT * FROM product WHERE id = ?';

        mysqlConnection.query(queryGetProduct, [productId], (error, results) => {
            if (error) {
                console.error(error);
                return common.reply(res, 500, true, 'Internal Server Error...');
            }

            if (results.length === 0) {
                return common.reply(res, 404, true, 'Product Not Found');
            }

            // RESPOND
            const data = results;
            return common.reply(res, 200, false, 'Product Data Retrieved Successfully...', data);
        });
    } catch (error) {
        console.error(error);
        return common.reply(res, 500, true, 'Internal Server Error...');
    }
};


// Validation Middleware
exports.validateUpdateProduct = [
    query('productId')
      .isInt().withMessage('Product ID must be an integer.')
      .notEmpty().withMessage('Product ID is required.'),
    body('name')
      .optional()
      .isString().withMessage('Product name must be a string.'),
    body('price')
      .optional()
      .isFloat({ gt: 0 }).withMessage('Price must be a positive number.'),
    body('quantity')
      .optional()
      .isInt({ gt: 0 }).withMessage('Quantity must be a positive integer.'),
    body('description')
      .optional()
      .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters.'),
  ];
  
// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return common.reply(res, 400, true, 'Validation failed.');
    }
  
    try {
      const productId = req.query.productId;
  
      // Check if product exists
      const findProductQuery = 'SELECT * FROM product WHERE id = ?';
      mysqlConnection.query(findProductQuery, [productId], (error, results) => {
        if (error) {
          console.error(error);
          return common.reply(res, 500, true, 'Internal Server Error...');
        }
  
        if (results.length === 0) {
          return common.reply(res, 404, true, 'Product Not Found');
        }
  
        // Prepare update query
        const { name, price, quantity } = req.body;
  
        const updateProductQuery = 'UPDATE product SET name = ?, price = ?, quantity = ? WHERE id = ?';
        mysqlConnection.query(updateProductQuery, [name, price, quantity, productId], (error) => {
          if (error) {
            console.error(error);
            return common.reply(res, 500, true, 'Internal Server Error...');
          }
  
          // RESPOND
          const data = {
            product: {
              id: productId,
              name,
              price,
              quantity
            }
          };
          return common.reply(res, 200, false, 'Product Details Updated Successfully...', data);
        });
      });
  
    } catch (error) {
      console.log(error);
      return common.reply(res, 500, true, 'Internal Server Error...');
    }
  };

  // Validation Middleware
exports.validateDeleteProduct = [
    query('productId')
      .isInt().withMessage('product ID must be an integer.')
      .notEmpty().withMessage('product ID is required.'),
  ];

  // DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return common.reply(res, 400, true, 'Validation failed.');
    }
  
    try {
      const productId = req.query.productId;
  
      // Check if product exists
      const findProductQuery = 'SELECT * FROM product WHERE id = ?';
      mysqlConnection.query(findProductQuery, [productId], (error, results) => {
        if (error) {
          console.error(error);
          return common.reply(res, 500, true, 'Internal Server Error...');
        }
  
        if (results.length === 0) {
          return common.reply(res, 404, true, 'Product Not Found');
        }
  
        // Get product data before deletion
        const deletedProduct = results[0];
  
        const deleteProductQuery = 'DELETE FROM product WHERE id = ?';
        mysqlConnection.query(deleteProductQuery, [productId], (error) => {
          if (error) {
            console.error(error);
            return common.reply(res, 500, true, 'Internal Server Error...');
          }
  
          // RESPOND
          const data = {
            product: {
              id: deletedProduct.id,
              name: deletedProduct.name,
              price: deletedProduct.price,
              quantity: deletedProduct.quantity
            }
          };
          return common.reply(res, 200, false, 'Product Deleted Successfully...', data);
        });
      });
    } catch (error) {
      console.log(error);
      return common.reply(res, 500, true, 'Internal Server Error...');
    }
  };
  
  

  
  