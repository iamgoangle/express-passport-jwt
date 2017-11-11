const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const helmet = require('helmet');

const APP_CONFIG = require('./config');
global.app = express();

// =======================
// passport ==============
// =======================
app.use(passport.initialize());
require('./config/passport')(passport);
// passport.use('jwt', require('./config/passport')(passport));

// =======================
// configuration =========
// =======================
const port = process.env.PORT || 3000;
mongoose.connect(APP_CONFIG.MONGO_URL, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;

app.set('superSecret', APP_CONFIG.API_SECRET);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// =======================
// security ==============
// =======================
app.use(helmet());
app.disable('x-powered-by');

// =======================
// route =================
// =======================
const UserController = require('./controllers/User');
const Authentication = require('./controllers/Authentication');

app.post('/api/login', Authentication);
app.post('/api/user/signup', UserController.signup);
app.get('/api/user/getUsers', passport.authenticate('jwt', { session: false }), UserController.getUsers);

app.listen(port, () => {
  console.log(`Start the server at http://localhost:${port}`);
});