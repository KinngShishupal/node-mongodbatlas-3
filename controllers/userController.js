const User = require("../models/userModel");

const getAllUsers = async(req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({
      status: 'success',
      results:users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
const createUser = (req, res) => {};

const getUser = (req, res) => {};
const updateUser = (req, res) => {};
const deleteUser = (req, res) => {};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
