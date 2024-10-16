const RecipeBook = require("../models/recipeBook.model");

const getRecipeBook = async (req, res) => {
  try {
    const recipeBook = await RecipeBook.findOne({ userId: req.user.id }); // Используем ID из токена
    if (!recipeBook) return res.status(404).send("Recipe book not found");

    res.json(recipeBook);
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

    res.status(201).json(recipeBook);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const removeFromRecipeBook = async (req, res) => {
  const { recipeId } = req.body;

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

module.exports = { getRecipeBook, addToRecipeBook, removeFromRecipeBook };
