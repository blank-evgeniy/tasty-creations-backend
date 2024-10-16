const express = require("express");
const {
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  createRecipe,
} = require("../controllers/recipe.controller.js");
const { authMiddleware, isAdmin } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", authMiddleware, isAdmin, createRecipe);
router.put("/:id", authMiddleware, isAdmin, updateRecipe);
router.delete("/:id", authMiddleware, isAdmin, deleteRecipe);

module.exports = router;
