const db = require("../db/db");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function getLoginPage(req, res) {
  const message = req.flash("error") || req.flash("success");
  res.render("login", {
    title: "Login",
    message: message,
  });
}

async function getSignUp(req, res) {
  res.render("signup", {
    title: "Sign Up",
  });
}

async function postSignUp(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("sign-up", {
        title: "Sign Up",
        errors: errors.array(),
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.createUser(req.body.username, hashedPassword);
    req.flash("success", "User created successfully!");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLoginPage,
  getSignUp,
  postSignUp,
};
