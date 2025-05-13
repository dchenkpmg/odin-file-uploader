const { Router } = require("express");
const {
  signUpValidation,
  loginValidation,
} = require("../middlewares/validation");
const router = Router();
const controller = require("../controllers/indexController");
const passport = require("passport");

router.get("/", controller.getLoginPage);
router.post(
  "/",
  loginValidation,
  passport.authenticate("local", {
    successRedirect: "/files/root",
    failureRedirect: "/",
    failureFlash: true,
  }),
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", controller.getSignUp);
router.post("/signup", signUpValidation, controller.postSignUp);

module.exports = router;
