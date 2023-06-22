module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/register", users.create);

  // login
  router.post("/login", users.login);

  // send otp
  router.post("/sendOtp", users.sendOTP);

  // verify otp
  router.post("/verifyOtp", users.verifyOTP);

  // verify user account
  router.post("/verifyUserAccount", users.verifyUserAccount);

  app.use('/api/user', router);
};
