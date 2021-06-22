/* bookmarksRouter.js */

const express = require("express");
const router = express.Router();
const controller = require("../controller/bookmarksController.js");

router.get("/", controller.findAll);
router.get("/:id", controller.findById);

router.post("/", controller.create);

router.delete("/:id", controller.delete);

router.put("/:id", controller.insert_replace);
router.patch("/:id", controller.update);

module.exports = router;
