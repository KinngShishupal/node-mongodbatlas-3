const User = require('../models/userModel');
var jwt = require('jsonwebtoken');


const signup = async (req, res, next) => {
  try {
    // const newUSer = await User.create(req.body);
    // the below methodology allows us to take only required fields
    const newUSer = await User.create({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      passwordConfirm:req.body.passwordConfirm
    });

    // const token = jwt.sign(object for all the data we want to store insidetoken, secret String, options)
    const token = jwt.sign({id:newUSer._id},process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN})
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

module.exports = {
  signup,
};
