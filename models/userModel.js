const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User have a Name ...'],
    // unique: true,
    // trim: true,
    // maxlength: [40, 'Name Should be less than 40'],
    // minlength: [5, 'Name Should be more than 5'],
  },
  email: {
    type: String,
    required: [true, 'User Must have a Email ...'],
    unique: true,
    lowercase: true, // transform email into lowercase
    validate: [validator.isEmail, 'Please Provide a valid email address'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String, 
    required: [true, 'Please Provide a valid password'],
    minlength: [8, 'Name Should be more than 8'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate:{
      // this works for create and save only not for update
      validator: function(el){
        return this.password === el
      },
      message: 'Password Mismatched ..'
    }
  },
});

userSchema.pre('save',async function(next){
if(!this.isModified('password')){
  // to check if password was actually modified
  return next()
};

this.password = await bcrypt.hash(this.password,12); // pasword hashing, default salt value is 10
this.passwordConfirm = undefined; // this allows us to not save passwordConform fields into the database
next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
