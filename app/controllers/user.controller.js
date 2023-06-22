const db = require("../models");
const utilsHandler = require("../handlers/utils.js");
const validationHandler = require("../handlers/validation.js");
const requiredParams = require("../config/requiredParams.json");
const twilio = require("../handlers/twilio.js");
const User = db.users;

// Register a new User 
exports.create = async (req, res) => {
  try {
    // Validate request
    validationHandler.requiredParams(req.body, requiredParams.register);
   
    // Check if user already exists
    User.findOne({ where: { mobile: req.body.mobile } })
      .then(data => {
        if (data) {
          res.status(400).send({
            message: "User already exists!"
          });
          return;
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
    const passwordHash = utilsHandler.encryptPassword(req.body.password);

    // Create a user
    const user = {
      email: req.body.email || "",
      mobile: req.body.mobile.replace(/ /g, ""),
      password: passwordHash,
      name: req.body.name || "",
      isVerified: false
    };
    const data = await twilio.sendOTP(req.body.mobile, "sms");
    if (data) {
        // Save User in the database
        User.create(user)
        .then(data => {
          twilio.sendOTP(req.body.mobile, "sms");
          res.send({
            message: "User registered successfully!",
            data: data
          });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the user."
          });
        });
    } else {
      res.status(400).send({
        message: "Invalid mobile number!",
        success: false
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the user."
    });
  }
};

// Login a User
exports.login = async (req, res) => {
  try {
    validationHandler.requiredParams(req.body, requiredParams.login);

    // get user from database
    User.findOne({ where: { mobile: req.body.mobile.replace(/ /g, ""), isVerified: true } })
      .then(data => {
        //check if user exists
        if (!data) {
          res.status(400).send({
            message: "User not found!"
          });
          return;
        } else {
          if (!utilsHandler.verifyPassword(req.body.password, data.password)) {
            res.status(400).send({
              message: "Invalid password!"
            });
            return;
          } else {
            res.send({
              message: "Login successful!"
            });
          }
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  }

};
        
// Send otp to user
exports.sendOTP = async (req, res) => {
  try {
    validationHandler.requiredParams(req.body, requiredParams.sendOTP);
    const data = twilio.sendOTP(req.body.mobile, "sms");
    if (data) {
      res.send({
        message: "OTP sent successfully!",
        success: true
      });
    } else {
      res.status(400).send({
        message: "Invalid mobile number!",
        success: false
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while sending OTP.",
        success: false
    });
  }

};

// verify otp
exports.verifyOTP = async (req, res) => {
  try {
    validationHandler.requiredParams(req.body, requiredParams.verifyOTP);
    const data = await twilio.verifyOTP(req.body.mobile, req.body.otp);
    if (data) {
      res.send({
        message: "OTP verified successfully!",
        success: true
      });
    } else {
      res.status(400).send({
        message: "Invalid OTP!",
        success: false
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Invalid OTP!",
      success: false
    });
  }
};

// verify user account
exports.verifyUserAccount = (req, res) => {
  try {
    validationHandler.requiredParams(req.body, requiredParams.verifyAccount);
    const data = 
    twilio.verifyOTP(req.body.mobile, req.body.otp);
    if (data) {
      // user is verified
      User.update({ isVerified: true }, { where: { mobile: req.body.mobile.replace(/ /g, "") } });

      res.send({
        message: "Account verified successfully!",
        success: true
      });
    } else {
      res.status(400).send({
        message: "Invalid OTP!",
        success: false
      });
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the user."
    });
  }
};