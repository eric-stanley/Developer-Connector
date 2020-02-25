const validator = require('validator');
const keys = require('../config/keys');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
 let errors = {};
 const minNameChars = keys.registerPageNameMinChar;
 const maxNameChars = keys.registerPageNameMaxChar;
 const minPasswordChars = keys.registerPagePasswordMinChar;
 const maxPasswordChars = keys.registerPagePasswordMaxChar;

 data.name = !isEmpty(data.name) ? data.name : '';
 data.email = !isEmpty(data.email) ? data.email : '';
 data.password = !isEmpty(data.password) ? data.password : '';
 data.password2 = !isEmpty(data.password2) ? data.password2 : '';

 if (!validator.isLength(data.name, { min: minNameChars, max: maxNameChars })) {
  errors.name = 'Name must be between ' + minNameChars + ' and ' + maxNameChars + ' characters';
 }

 if (validator.isEmpty(data.name)) {
  errors.name = 'Name field is required';
 }

 if (validator.isEmpty(data.email)) {
  errors.email = 'Email field is required';
 }

 if (!validator.isEmail(data.email)) {
  errors.email = 'Email is invalid';
 }

 if (validator.isEmpty(data.password)) {
  errors.password = 'Password field is required';
 }

 if (!validator.isLength(data.password, { min: minPasswordChars, max: maxPasswordChars })) {
  errors.password = 'Password must be atleast ' + minPasswordChars + ' characters';
 }

 if (validator.isEmpty(data.password2)) {
  errors.password2 = 'Confirm Password field is required';
 }

 if (!validator.equals(data.password, data.password2)) {
  errors.password2 = 'Passwords must match';
 }

 return {
  errors,
  isValid: isEmpty(errors)
 }
}