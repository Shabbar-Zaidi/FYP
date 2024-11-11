const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

// Controller:
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );


// // Same as above but with router.route():
// // Render the signup form
// router.get("/signup", userController.renderSignupForm);

// // Signup route
// router.post("/signup", wrapAsync(userController.signup));

// // Render the login form
// router.get("/login", userController.renderLoginForm);

// // Login route
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     // passport.authenticate() is a function provided by passport. It is used to authenticate user.
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );



// Logout route
router.get("/logout", userController.logout);

module.exports = router;
