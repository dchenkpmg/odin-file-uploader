const db = require("../db/db");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function getLoginPage(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/files/root");
  }
  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");
  const message = errorMessage.length > 0 ? errorMessage : successMessage;
  res.render("login", {
    title: "File Storage",
    errMessages: message,
  });
}

async function getSignUp(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/files/root");
  }

  const errorMessage = req.flash("error");
  const successMessage = req.flash("success");

  const message = errorMessage.length > 0 ? errorMessage : successMessage;
  const errMessages = message.length > 0 ? message : [];
  res.render("signup", {
    title: "File Storage - Sign Up",
    errMessages: errMessages,
  });
}

async function postSignUp(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("signup", {
        title: "Sign Up - File Storage",
        errors: errors.array(),
        errMessages: [],
      });
    }
    const existingUser = await db.getUserByUsername(req.body.username);
    if (existingUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/signup");
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
