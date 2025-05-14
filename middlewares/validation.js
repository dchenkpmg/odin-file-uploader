const { body } = require("express-validator");

const signUpValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Username must be at least 3 characters long and at most 20 characters long",
    ),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "Password must be at least 6 characters long and at most 20 characters long",
    ),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match."),
];

const loginValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage(
      "Username must be at least 3 characters long snd at most 20 characters long",
    ),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage(
      "Password must be at least 6 characters long and at most 20 characters long",
    ),
];

module.exports = {
  signUpValidation,
  loginValidation,
};
