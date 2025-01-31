const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const RecipeBook = require("../models/recipeBook.model");

const register = async (req, res) => {
  const { username, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, password: hashedPassword, role });

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(409).json({ message: "Username already taken" });
  }

  try {
    const newUser = await user.save();

    if (newUser.role === "user") {
      await RecipeBook.create({ userId: newUser._id });
    }

    res.status(201).send("User registered");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const user_data = { role: user.role, username: user.username };

  res.json({ token, user_data });
};

module.exports = { login, register };
