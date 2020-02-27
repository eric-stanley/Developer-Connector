const validator = require('validator');
const isEmpty = require('./is-empty');
const keys = require('../config/keys');

module.exports = function validatePostInput(data) {
 let errors = {};
 const minLength = keys.postMinLength;
 const maxLength = keys.postMaxLength;

 data.text = !isEmpty(data.text) ? data.text : '';

 if (!validator.isLength(data.text, { min: minLength, max: maxLength })) {
  errors.text = 'Post must be between ' + minLength + ' and ' + maxLength + ' characters';
 }

 if (validator.isEmpty(data.text)) {
  errors.text = 'Text field is required';
 }

 return {
  errors,
  isValid: isEmpty(errors)
 }
}