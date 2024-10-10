const { body, query, validationResult } = require('express-validator');
const mysqlConnection = require('../../connection');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const common = require('../../common');
const passport = require('passport');

// Validation Middleware
exports.validateRegisterUser = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email')
    .isEmail().withMessage('Invalid email format.')
    .custom(async (value) => {
      const queryFindUser = 'SELECT * FROM user WHERE email = ?';
      const [results] = await mysqlConnection.promise().query(queryFindUser, [value]);
      if (results.length > 0) {
        throw new Error('Email already registered.');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

// // REGISTER USER
// exports.registerUser = async (req, res) => {
//   // Validate inputs
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//      return common.reply(res ,400 , true ,'Validation failed.');
//   }

//   try {
//     // Hash the password
//     const hashpassword = await bcrypt.hash(req.body.password, 10);

//     // Prepare new user data
//     const newUser = {
//       name: req.body.name,
//       email: req.body.email,
//       password: hashpassword,
//     };
//     console.log(newUser);

//     // Insert new user into the database
//     const sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
//     mysqlConnection.query(sql, [newUser.name, newUser.email, newUser.password], (error, results) => {
//       if (error) {
//         console.error(error);
//         return common.reply(res , 500 , true ,`Error registering user...`);
//       }

//       // Response
//       const data = {
//         user:{
//           id: results.insertId,
//             name: newUser.name,
//             email: newUser.email
//         }
//       };
//       return common.reply(res , 201 , false ,`New User Added Successfully...` , data);

//     });
//   } catch (error) {
//     console.log(error);
//     return common.reply(res , 500 , true ,`Internal Server Error...`);
//   }
// };

// REGISTER USER
exports.registerUser = async (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return common.reply(res, 400, true, 'Validation failed.');
  }

  passport.authenticate('local-register', (err, user, info) => {
    if (err) {
      console.error(err);
      return common.reply(res, 500, true, 'Internal Server Error...');
    }

    if (!user) {
      return common.reply(res, 400, true, info.message);
    }

    const data = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    // return common.reply(res, 201, false, 'New User Added Successfully...', data);
    res.redirect('login-user');
  })(req, res, next);
};

// Validation Middleware
exports.validateLoginUser = [
  body('email')
    .isEmail().withMessage('Invalid email format.')
    .notEmpty().withMessage('Email is required.'),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

// LOGIN USER
exports.loginUser = (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return common.reply(res, 400, true, 'Validation failed.');
  }

  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      console.error(err);
      return common.reply(res, 500, true, 'Internal Server Error...');
    }
    console.log(user);

    if (!user) {
      // return common.reply(res, 401, true, info.message); // 'Email Not Found.'
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, "User" || 'defaultSecret');
    console.log(token);

    // Set the token in a cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 6000 * 60 * 100  // 10 hours
    });

    // Set user role in a cookie
    res.cookie('role', user.role, {
      httpOnly: true,
      maxAge: 6000 * 60 * 100   // 10 hours
    });


    // Set user role in a cookie
    res.cookie('email', user.email, {
      httpOnly: true,
      maxAge: 6000 * 60 * 100   // 10 hours
    });

    const data = {
      user: { id: user.id, name: user.name, email: user.email },
    };
    console.log(data);

    if (user.role === 'buyer') {
      res.redirect('/api/buy-product');
    } else {
      res.redirect('/api/add-product');
    };
  })(req, res, next);
};



// // GET ALL USER
// exports.getAllUser = async (req, res) => {
//   try {
//     const GetAllUser = 'SELECT * FROM user'; 
//     mysqlConnection.query(GetAllUser, (error, results) => {
//       if (error) {
//         console.error(error);
//         return common.reply(res , 500 , true ,`Internal Server Error...`);
//       }

//       if (results.length === 0) {
//         return common.reply(res , 404 , true , `User's Data Not Found..!`);
//       }

//       // RESPOND
//       const data = results;
//       return common.reply(res , 200 , false , `User's Data Retrieved Successfully...` , data);
//     });

//   } catch (error) {
//     console.log(error);
//     return common.reply(res , 500 , true ,`Internal Server Error...`);
//   }
// };

// GET ALL USER
exports.getAllUser = async (req, res) => {
  try {
    // Destructure query parameters for pagination, sorting, searching, and filtering
    const { page = 1, limit = 6, sortBy = 'id', order = 'ASC', search = '' } = req.query;

    // Convert pagination parameters to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // SQL query for user count (for pagination)
    const countQuery = 'SELECT COUNT(*) as totalCount FROM user';

    mysqlConnection.query(countQuery, (error, countResults) => {
      if (error) {
        console.error(error);
        return common.reply(res, 500, true, `Internal Server Error...`);
      }

      const totalCount = countResults[0].totalCount;

      // SQL query for fetching users with search, sorting, and pagination
      const searchCondition = search ? `WHERE name LIKE ? OR email LIKE ?` : '';
      const sqlQuery = `
        SELECT * FROM user 
        ${searchCondition} 
        ORDER BY ?? ${order} 
        LIMIT ? OFFSET ?`;

      // Create search parameters
      const searchParams = search ? [`%${search}%`, `%${search}%`, sortBy, limitNumber, offset] : [sortBy, limitNumber, offset];

      mysqlConnection.query(sqlQuery, searchParams, (error, results) => {
        if (error) {
          console.error(error);
          return common.reply(res, 500, true, `Internal Server Error...`);
        }

        if (results.length === 0) {
          return common.reply(res, 404, true, `User's Data Not Found..!`);
        }

        // Response with pagination data
        const responseData = {
          totalCount,
          page: pageNumber,
          totalPages: Math.ceil(totalCount / limitNumber),
          users: results
        };

        return common.reply(res, 200, false, `User's Data Retrieved Successfully...`, responseData);
      });
    });
  } catch (error) {
    console.log(error);
    return common.reply(res, 500, true, `Internal Server Error...`);
  }
};


// Validation Middleware
exports.validateGetUser = [
  query('userId')
    .isInt().withMessage('User ID must be an integer.')
    .notEmpty().withMessage('User ID is required.'),
];

// GET SPECIFIC USER
exports.getUser = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return common.reply(res, 400, true, 'Validation failed.');
  }

  try {
    const userId = req.query.userId;

    // Query to find the user by ID
    const queryGetUser = 'SELECT * FROM user WHERE id = ?';

    mysqlConnection.query(queryGetUser, [userId], (error, results) => {
      if (error) {
        console.error(error);
        return common.reply(res, 500, true, `Internal Server Error...`);
      }

      if (results.length === 0) {
        return common.reply(res, 404, true, `User Not Found`);
      }

      // RESPOND
      const data = results;
      return common.reply(res, 200, false, `User's Data Retrieved Successfully...`, data);
    });
  } catch (error) {
    console.error(error);
    return common.reply(res, 500, true, `Internal Server Error...`);
  }
};

// Validation Middleware
exports.validateUpdateUser = [
  query('userId')
    .isInt().withMessage('User ID must be an integer.')
    .notEmpty().withMessage('User ID is required.'),
  body('name')
    .optional()
    .isString().withMessage('Name must be a string.'),
  body('email')
    .optional()
    .isEmail().withMessage('Email must be a valid email address.'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

// UPDATE USER
exports.updateUser = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return common.reply(res, 400, true, 'Validation failed.');
  }

  try {
    const userId = req.query.userId;

    // Check if user exists
    const FindUser = 'SELECT * FROM user WHERE id = ? ';
    mysqlConnection.query(FindUser, [userId], (error, results) => {
      if (error) {
        console.error(error);
        return common.reply(res, 500, true, `Internal Server Error...`);
      }

      if (results.length === 0) {
        return common.reply(res, 404, true, `User Not Found`);
      }

      // Prepare update query
      const { name, email, password } = req.body;

      const UpdateUser = 'UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?';
      mysqlConnection.query(UpdateUser, [name, email, password, userId], (error) => {
        if (error) {
          console.error(error);
          return common.reply(res, 500, true, `Internal Server Error...`);
        }

        // RESPOND
        const data = {
          user: {
            id: userId,
            name,
            email
          }
        }
        return common.reply(res, 200, false, 'User Details Updated Successfully...', data);
      });
    });

  } catch (error) {
    console.log(error);
    return common.reply(res, 500, true, `Internal Server Error...`);
  }
};

// Validation Middleware
exports.validateDeleteUser = [
  query('userId')
    .isInt().withMessage('User ID must be an integer.')
    .notEmpty().withMessage('User ID is required.'),
];

// DELETE USER
exports.deleteUser = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return common.reply(res, 400, true, 'Validation failed.');
  }

  try {
    const userId = req.query.userId;

    // Check if user exists
    const findUser = 'SELECT * FROM user WHERE id = ? ';
    mysqlConnection.query(findUser, [userId], (error, results) => {
      if (error) {
        console.error(error);
        return common.reply(res, 500, true, `Internal Server Error...`);
      }

      if (results.length === 0) {
        return common.reply(res, 404, true, `User Not Found`);
      }

      // Get user data before deletion
      const deletedUser = results[0];

      const deleteUser = 'DELETE FROM user WHERE id = ?';
      mysqlConnection.query(deleteUser, [userId], (error) => {
        if (error) {
          console.error(error);
          return common.reply(res, 500, true, `Internal Server Error...`);
        }

        // RESPOND
        const data = {
          user: {
            id: deletedUser.id,
            name: deletedUser.name,
            email: deletedUser.email,
            isDelete: deletedUser.isDelete,
          }
        }
        return common.reply(res, 200, false, 'User Deleted Successfully...', data);
      });
    });
  } catch (error) {
    console.log(error);
    return common.reply(res, 500, true, `Internal Server Error...`);
  }
};

// Validation Middleware
exports.validateUpdatePassword = [
  body('oldPassword')
    .notEmpty().withMessage('Old password is required.'),
  body('newPassword')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required.'),
];

// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return common.reply(res, 400, true, 'Validation failed.');
  }

  try {
    // Query to get the user by ID
    const [user] = await mysqlConnection.promise().query('SELECT * FROM user WHERE id = ?', [req.query.id]);

    if (user.length === 0) {
      return common.reply(res, 404, true, `User Not Found`);
    }

    // Compare the old password
    const comparePassword = await bcrypt.compare(req.body.oldPassword, user[0].password);
    if (!comparePassword) {
      return common.reply(res, 401, true, 'Old password does not match...');
    }

    // Check if new password is the same as the old one
    if (req.body.newPassword === req.body.oldPassword) {
      return common.reply(res, 401, true, 'New password cannot be the same as the old password...');

    }

    // Check if new password matches confirmation
    if (req.body.newPassword !== req.body.confirmPassword) {
      return common.reply(res, 401, true, 'New password and confirm password do not match...');

    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(req.body.newPassword, 10);

    // Update the password in the database
    await mysqlConnection.promise().query('UPDATE user SET password = ? WHERE id = ?', [hashPassword, req.query.id]);

    // Retrieve the updated user object
    const [updatedUser] = await mysqlConnection.promise().query('SELECT * FROM user WHERE id = ?', [req.query.id]);

    // RESPOND
    return common.reply(res, 200, false, 'Password changed successfully...');


  } catch (error) {
    console.error(error);
    return common.reply(res, 500, true, `Internal Server Error...`);
  }
};

// Validation Middleware
exports.validateUploadProfile = [
  body('userId')
    .isInt().withMessage('User ID must be an integer.')
    .notEmpty().withMessage('User ID is required.'),
];

// UPLOAD PROFILE
exports.uploadProfile = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return common.reply(res, 400, true, 'Validation failed.');
  }

  try {
    const userId = req.body.userId;
    const profilePicturePath = req.file.path;

    console.log(userId);
    console.log(req.file);

    const [result] = await mysqlConnection.promise().query('UPDATE user SET ProImg = ? WHERE id = ?', [profilePicturePath, userId]);

    if (result.affectedRows === 0) {
      return common.reply(res, 404, true, `User Not Found`);

    }

    // RESPOND
    const data = {
      data: { profilePicturePath }
    }
    return common.reply(res, 200, false, 'Profile picture uploaded successfully...', data);


  } catch (error) {
    console.error(error);
    return common.reply(res, 500, true, `Internal Server Error...`);
  }
};

// SIGN-OUT USER
exports.signOut = (req, res) => {

  // CLEAR TOKEN
  res.clearCookie('token', { httpOnly: true });

  // CLEAR ROLE 
  res.clearCookie('role', { httpOnly: true });

  // res.status(200).json({ message: 'Successfully signed out...' });
  res.redirect('/api/register-user');
};













