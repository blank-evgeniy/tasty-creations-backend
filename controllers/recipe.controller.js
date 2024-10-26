const Category = require("../models/category.model.js");
const Recipe = require("../models/recipe.model.js");

const getRecipes = async (req, res) => {
  try {
    const { category: categoryPath, limit = 10, page = 1 } = req.query; // Получаем category из query параметров

    const limitNumber = parseInt(limit);
    const pageNumber = parseInt(page);
    let recipes;
    let totalRecipes;

    if (categoryPath) {
      const category = await Category.findOne({ path: categoryPath });

      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }

      recipes = await Recipe.find({ category: category._id })
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber);

      totalRecipes = await Recipe.find({
        category: category._id,
      }).countDocuments();
    } else {
      recipes = await Recipe.find({})
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber);

      totalRecipes = await Recipe.countDocuments();
    }

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
    const recipe = await Recipe.findById(id);
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
