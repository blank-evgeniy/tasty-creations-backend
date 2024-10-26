const Recipe = require("../models/recipe.model");
const RecipeBook = require("../models/recipeBook.model");

const getRecipeBook = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findOne({ userId: req.user.id }); // Используем ID из токена
    if (!recipeBook) return res.status(404).send("Recipe book not found");

    const recipeIds = recipeBook.recipes;

    const [recipes, totalRecipes] = await Promise.all([
      Recipe.find({ _id: { $in: recipeIds } }).lean(),
      Recipe.countDocuments({ _id: { $in: recipeIds } }),
    ]);

    res.json({ recipes, totalRecipes });
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const addToRecipeBook = async (req, res) => {
  const { recipeId } = req.body;

  try {
    const recipeBook = await RecipeBook.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { recipes: recipeId } },
      { new: true }
    ); // Используем ID из токена для поиска, после добавляем id рецепта из запроса
    if (!recipeBook) return res.status(404).send("Recipe book not found");

    const recipeIds = recipeBook.recipes;
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });

    res.status(201).json(recipes);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const removeFromRecipeBook = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipeBook = await RecipeBook.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { recipes: recipeId } },
      { new: true }
    ); // Используем ID из токена для поиска, после удаляем пришедший id рецепта

    res.status(201).json(recipeBook);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getRecipeBook,
  addToRecipeBook,
  removeFromRecipeBook,
};
