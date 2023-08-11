var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');   //for encrypting password with hash

//Models
var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.np$/, // Allow only 'edu.np' domain
  },
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 9,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  level: {
    type: String,
    
  },
  userstatus: {
    type: String,
    required: true,
  },
  activateStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetToken: {
    type: String,
    default: ''
  }
})

//Methods to encrypt and decrypt password
//synchronous function
UserSchema.methods.hashPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

UserSchema.methods.comparePassword = function(password, hash){
  return bcrypt.compareSync(password, hash)
}

var User = module.exports = mongoose.model('User', UserSchema, 'users');
