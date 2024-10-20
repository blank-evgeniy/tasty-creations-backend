const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
  },
  { id: false }
);

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [IngredientSchema],
      required: true,
    },
    steps: {
      type: [String],
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
    },
    icon: { type: String },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;
