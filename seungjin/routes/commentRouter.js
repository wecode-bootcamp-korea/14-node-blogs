const { validateToken } = require("../middlewares");
const { commentController } = require("../controllers");
const express = require("express");
const router = express.Router();

router.get("/:id");
router.post("/", validateToken);
router.put("/:id", validateToken);
router.delete("/:id", validateToken);

module.exports = router;
