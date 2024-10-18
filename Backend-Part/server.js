const express = require('express');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
const cookieParser = require('cookie-parser');
const common = require('./common');
const cors = require('cors');
const path = require('path');

const app = express();
require('dotenv').config();
const port = process.env.PORT;

// BODY PARSER
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173' ,
  credentials: true
}));

// EJS TEMPLATE ENGINE
app.set('view engine', 'ejs');

// COOKIE MIDDLEWARE
app.use(common.cookie);

// SET VIEW DIRECTORY
app.set('views', path.join(__dirname, 'src', 'views'));

// PASSPORT
app.use(session({
  secret: process.env.KEY,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

// ALL ROUTES
app.use('/', require('./src/routes/allroute'));

app.listen(port, () => {
  console.log(`Server Start At http://localhost:${port}`);
});