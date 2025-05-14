function isAuth(req, res, next) {
  console.log("AUTH OBJECT " + req.isAuthenticated());
  console.log(req.session);
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send("Unauthorized");
  }
}
module.exports = {
  isAuth,
};
