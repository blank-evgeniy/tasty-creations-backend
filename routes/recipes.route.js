const express = require("express");
const {
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  getRandomRecipeId,
} = require("../controllers/recipe.controller.js");
const { authMiddleware, isAdmin } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", getRecipes);
router.get("/random", getRandomRecipeId);
router.get("/:id", getRecipeById);
router.post("/", authMiddleware, isAdmin, createRecipe);
router.put("/:id", authMiddleware, isAdmin, updateRecipe);
router.delete("/:id", authMiddleware, isAdmin, deleteRecipe);

module.exports = router;
