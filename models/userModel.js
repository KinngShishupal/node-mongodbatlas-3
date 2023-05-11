const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');//inbuild


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
    select:false, // this will come if we try to fetch all users
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
  passwordChangedAt:Date,
  role:{
    type:String,
    enum:['admin','user','guide','lead-guide'],
    default:'user'
  }
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

// this is called instance method which is available everywhere of user document
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
// here this.password will not work as that is select false
return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordsAfter = function(JWTTimeStamp){
  if(this.passwordChangedAt){
    // perform comparison only after user has changed the password
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000);// converting time into seconds
    // console.log('www',changedTimeStamp, JWTTimeStamp)
    console.log('eeeeeeeee',JWTTimeStamp<changedTimeStamp,{JWTTimeStamp, changedTimeStamp})
    return JWTTimeStamp<changedTimeStamp;
  }
return false;
}

userSchema.methods.createPasswordResetToken = function(){

}

const User = mongoose.model('User', userSchema);

module.exports = User;
