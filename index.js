const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoutes = require("./routes/recipes.route");
const authRoutes = require("./routes/auth.route");
const recipeBookRoutes = require("./routes/recipeBook.route");
const categoryRoutes = require("./routes/category.route");
const profileRoutes = require("./routes/profile.route");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowlist = [
  "http://localhost:3000",
  "https://tasty-creations-coral.vercel.app",
];

const corsOptions = {
  origin: allowlist,
  credentials: true,
};

app.use(cors(corsOptions));

// middlewares
app.use(express.json());

// routes
app.use("/api/recipes", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recipe_book", recipeBookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

// запуск сервера
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`App listening on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed");
  });
