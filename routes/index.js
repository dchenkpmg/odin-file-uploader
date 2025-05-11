const { Router } = require("express");
const router = Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});
