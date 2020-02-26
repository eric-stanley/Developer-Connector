const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  mongoURI: 'mongodb+srv://' + process.env.MONGODB_USERNAME +
    ':' + process.env.MONGODB_PASSWORD +
    '@' + process.env.MONGODB_CLUSTER + '-rej5u.mongodb.net/' +
    process.env.MONGODB_DATABASE + '?retryWrites=true&w=majority',
  secretOrKey: process.env.JWT_SECRET_KEY,
  keyExpiresIn: Number(process.env.JWT_TOKEN_DURATION),
  tokenPreText: process.env.JWT_TOKEN_PRETEXT,
  registerPageNameMinChar: Number(process.env.REGISTER_PAGE_NAME_MIN_CHAR),
  registerPageNameMaxChar: Number(process.env.REGISTER_PAGE_NAME_MAX_CHAR),
  registerPagePasswordMinChar: Number(process.env.REGISTER_PAGE_PASSWORD_MIN_CHAR),
  registerPagePasswordMaxChar: Number(process.env.REGISTER_PAGE_PASSWORD_MAX_CHAR),
  profileHandleMinChar: Number(process.env.PROFILE_HANDLE_MIN_CHAR),
  profileHandleMaxChar: Number(process.env.PROFILE_HANDLE_MAX_CHAR)
}