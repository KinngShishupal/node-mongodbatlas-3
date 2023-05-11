const util = require('util'); // inbuild
const User = require('../models/userModel');
var jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
  try {
    // const newUSer = await User.create(req.body);
    // the below methodology allows us to take only required fields
    const newUSer = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // const token = jwt.sign(object for all the data we want to store insidetoken, secret String, options)
    const token = jwt.sign({ id: newUSer._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUSer,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1. check if email and pass exits

    if (!email || !password) {
      const err = new AppError('Please provide email and password', 400);
      return next(err);
    }

    // 2. check if user exits and pass is correct
    const user = await User.findOne({ email: email }).select('+password'); // +password basically helps us to get fields for which select is set as false in schema as we need password here

    const correct = user
      ? await user.correctPassword(password, user.password)
      : false; // correctPassword is available as instance methods are available evrywhere that document is called, here we have called the document in user variable
    if (!user || !correct) {
      return next(new AppError('Incorrect email or password', 401));
    }
    // 3. if everything is ok , senf token to client
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
      status: 'success',
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const protect = async (req, res, next) => {
  try {
    // 1. getting token and check if its there
    // console.log('token>>>>>>>>>>', req.headers);
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // console.log('token++++++++++++', token);
    if (!token) {
      return next(
        new AppError(
          'You are not not logged in to get access, kindly log in',
          401
        )
      );
    }

    // 2. verification token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET); // promisify coverts something into promise, we could convert it into promise as third argument is a callback function 

    console.log('<><><>><>><',decoded); // this decoded data contains user id ans exp and creation date 
    // 3. check if user still exists(like user was deleted or changed password after he was logged in)
const userBasedOndecodedId = await User.findById(decoded.id);
if(!userBasedOndecodedId){
  return next(new AppError('The User belonging to this token No Longer exists', 401))
}
    // 4. check if user changes passwords after jwt was issued

    next();
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

module.exports = {
  signup,
  login,
  protect,
};
