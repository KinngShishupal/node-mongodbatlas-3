const User = require('../models/userModel');

const signup = async (req, res, next) => {
  try {
    const newUSer = await User.create(req.body);
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
