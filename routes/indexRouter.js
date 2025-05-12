const { Router } = require("express");
const router = Router();
const controller = require("../controllers/indexController");

router.get("/", controller.getLoginPage);
router.post("/", controller.postLoginPage);

router.get("/signup", controller.getSignUp);
router.post("/signup", controller.postSignUp);

// router.get("");

module.exports = router;
