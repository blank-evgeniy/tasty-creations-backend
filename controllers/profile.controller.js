const User = require("../models/user.model");

const getProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const profile = await User.findById(id);
    const { username, role } = profile;

    res.status(200).json({ username, role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile };
