const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  mongoURI: 'mongodb+srv://' + process.env.MONGODB_USERNAME +
    ':' + process.env.MONGODB_PASSWORD +
    '@' + process.env.MONGODB_CLUSTER + '-rej5u.mongodb.net/' +
    process.env.MONGODB_DATABASE + '?retryWrites=true&w=majority',
  secretOrKey: process.env.JWT_SECRET_KEY,
  keyExpiresIn: Number(process.env.JWT_TOKEN_DURATION),
  tokenPreText: process.env.JWT_TOKEN_PRETEXT
}