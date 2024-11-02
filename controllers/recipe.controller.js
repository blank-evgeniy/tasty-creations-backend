const mongoose = require("mongoose");
const Category = require("../models/category.model.js");
const Recipe = require("../models/recipe.model.js");

const getRecipes = async (req, res) => {
  try {
    const {
      category: categoryPath,
      search,
      sortBy,
      order,
      limit = 10,
      page = 1,
    } = req.query; // Получаем category из query параметров

    const limitNumber = Math.max(1, parseInt(limit));
    const pageNumber = Math.max(1, parseInt(page));
    const sortOrder = order === "desc" ? -1 : 1;

    let recipesQuery = Recipe.find({});
    let totalRecipesQuery = Recipe.find({});

    if (categoryPath) {
      const category = await Category.findOne({ path: categoryPath });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      recipesQuery = recipesQuery.where({ category: category._id });
      totalRecipesQuery = totalRecipesQuery.where({ category: category._id });
    }

    if (search) {
      recipesQuery = recipesQuery.where({
        name: { $regex: search, $options: "i" },
      });
      totalRecipesQuery = totalRecipesQuery.where({
        name: { $regex: search, $options: "i" },
      });
    }

    if (sortBy === "time") {
      recipesQuery = recipesQuery.sort({ time: sortOrder });
    } else if (sortBy === "calories") {
      recipesQuery = recipesQuery.sort({ calories: sortOrder });
    }

    const recipes = await recipesQuery
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    const totalRecipes = await totalRecipesQuery.countDocuments();
    const totalPages = Math.ceil(totalRecipes / limitNumber);

    res
      .status(200)
      .json({ totalRecipes, totalPages, currentPage: pageNumber, recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRandomRecipeId = async (req, res) => {
  try {
    const randomRecipe = await Recipe.aggregate([{ $sample: { size: 1 } }]);

    res.status(200).json(randomRecipe[0]._id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const recipe = await Recipe.findByIdAndUpdate(id, req.body);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const updatedRecipe = await Recipe.findById(id);

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const recipe = await Recipe.findByIdAndDelete(id, req.body);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecipes,
  getRandomRecipeId,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
