const { validateToken } = require("../middlewares");
const express = require("express");
const router = express.Router();

const { articleController } = require("../controllers");

router.get("/:id", articleController.findArticle);
router.post("/", validateToken, articleController.createArticle);
router.put("/:id", validateToken, articleController.updateArticle);
router.delete("/:id", validateToken, articleController.deleteArticle);

module.exports = router;
