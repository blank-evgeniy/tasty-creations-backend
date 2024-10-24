const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryByPath,
} = require("../controllers/category.controller");
const { authMiddleware, isAdmin } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", getCategories);
router.get("/:path", getCategoryByPath);
router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
