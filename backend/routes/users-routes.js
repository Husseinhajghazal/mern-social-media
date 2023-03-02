const express = require("express");
const { body } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    body("name").trim().notEmpty().withMessage("Name required."),
    body("email")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("Email required.")
      .isEmail()
      .withMessage("Please enter a valid email."),
    body("bio")
      .trim()
      .notEmpty()
      .withMessage("Bio required.")
      .isLength({ max: 50 })
      .withMessage("Max allowed characters 50."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password required.")
      .isLength({ max: 16, min: 8 })
      .withMessage("Password should be betweem 6 to 18 characters.")
      .matches(/(?=.*?[A-Z])/g)
      .withMessage("Password should contain at least 1 big letter.")
      .matches(/(?=.*?[a-z])/g)
      .withMessage("Password should contain at least 1 small letter.")
      .matches(/(?=.*?[0-9])/g)
      .withMessage("Password should contain at least 1 number."),
  ],
  usersControllers.signup
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("Email required.")
      .isEmail()
      .withMessage("Please enter a valid email."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password required.")
      .isLength({ max: 16, min: 8 })
      .withMessage("Password should be betweem 6 to 18 characters.")
      .matches(/(?=.*?[A-Z])/g)
      .withMessage("Password should contain at least 1 big letter.")
      .matches(/(?=.*?[a-z])/g)
      .withMessage("Password should contain at least 1 small letter.")
      .matches(/(?=.*?[0-9])/g)
      .withMessage("Password should contain at least 1 number."),
  ],
  usersControllers.login
);

router.use(checkAuth);

router.get("/", usersControllers.getOneUser);

router.patch(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name required."),
    body("bio")
      .trim()
      .notEmpty()
      .withMessage("Bio required.")
      .isLength({ max: 50 })
      .withMessage("Max allowed characters 50."),
    body("oldpassword")
      .trim()
      .notEmpty()
      .withMessage("Old password required.")
      .isLength({ max: 16, min: 8 })
      .withMessage("Old password should be betweem 6 to 18 characters.")
      .matches(/(?=.*?[A-Z])/g)
      .withMessage("Old password should contain at least 1 big letter.")
      .matches(/(?=.*?[a-z])/g)
      .withMessage("Old password should contain at least 1 small letter.")
      .matches(/(?=.*?[0-9])/g)
      .withMessage("Old password should contain at least 1 number."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password required.")
      .isLength({ max: 16, min: 8 })
      .withMessage("Password should be betweem 6 to 18 characters.")
      .matches(/(?=.*?[A-Z])/g)
      .withMessage("Password should contain at least 1 big letter.")
      .matches(/(?=.*?[a-z])/g)
      .withMessage("Password should contain at least 1 small letter.")
      .matches(/(?=.*?[0-9])/g)
      .withMessage("Password should contain at least 1 number."),
  ],
  usersControllers.editUser
);

router.get("/:uid", usersControllers.getProfile);

router.post("/:uid", usersControllers.follow);

router.delete("/:uid", usersControllers.unfollow);

router.get("/search/:un", usersControllers.search);

module.exports = router;
