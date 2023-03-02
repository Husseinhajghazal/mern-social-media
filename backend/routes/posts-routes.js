const express = require("express");
const { body } = require("express-validator");
const postsControllers = require("../controllers/posts-controllers");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.use(checkAuth);

router.get("/", postsControllers.getHomePage);

router.post(
  "/",
  fileUpload.single("image"),
  [
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description required.")
      .isLength({ max: 100 })
      .withMessage("Max character allowed 100."),
  ],
  postsControllers.createPost
);

router.delete("/:pid", postsControllers.deletePost);

router.post("/like/:pid", postsControllers.addLike);

router.delete("/like/:pid", postsControllers.removeLike);

module.exports = router;
