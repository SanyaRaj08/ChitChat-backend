const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const dotenv=require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();


// Create user using: POST "/api/auth/createuser" (no login required)
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
      
    }

    // Check whether the user exists already
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }],
    });

    if (existingUser) {
      if (
        existingUser.email === req.body.email 
      ) {
        return res
          .status(400)
          .json({success, error: "email already exists" });
      }
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    // Create the new user
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      pic:req.body.pic,
    };

    try {
      const createdUser = await User.create(newUser);
      const data = {
        user: {
          id: User.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success,authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//authenticate a user

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 3 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res
          .status(400)
          .json({ success,error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id, // Use user.id instead of User.id
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success,authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

//get logedin user details
router.post("/getuser",fetchuser, async (req, res) => {
  try {
    userId=req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user)
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;