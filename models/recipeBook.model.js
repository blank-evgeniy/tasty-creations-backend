const mongoose = require("mongoose");

const RecipeBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  recipes: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
  },
});

const RecipeBook = mongoose.model("RecipeBook", RecipeBookSchema);

module.exports = RecipeBook;
