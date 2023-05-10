const User = require('../models/userModel');

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
    res.status(201).json({
      status: 'success',
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
