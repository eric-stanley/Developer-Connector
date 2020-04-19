const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db config
const db = require('./config/keys').mongoURI;

// connect to mongoDB
mongoose
 .connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
 })
 .then(() => console.log('mongoDB connected'))
 .catch(err => console.log(err))

dotenv.config();
const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
 res.header("Access-Control-Allow-Origin", '*');
 res.header("Access-Control-Allow-Credentials", true);
 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
 res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
 next();
});

// passport middlewarq
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => console.log(`App listening on port ${port}!`));