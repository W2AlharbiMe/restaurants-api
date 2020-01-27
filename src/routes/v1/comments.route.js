const { Router } = require("express");

const commentsController = require("../../controllers/comments.controller");

const $authenticated = require("../../middleware/authenticated");
const $redis = require("../../middleware/redis");

const router = Router();

router.get("/", commentsController.index);

router.post("/", $authenticated, $redis, commentsController.create);

router.put("/:comment/", $authenticated, $redis, commentsController.update);

router.delete("/:comment/", $authenticated, $redis, commentsController.destroy);

module.exports = router;
