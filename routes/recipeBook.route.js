const express = require("express");
const {
  getRecipeBook,
  addToRecipeBook,
  removeFromRecipeBook,
} = require("../controllers/recipeBook.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getRecipeBook);
router.post("/", authMiddleware, addToRecipeBook);
router.delete("/", authMiddleware, removeFromRecipeBook);

module.exports = router;
