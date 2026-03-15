const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // check if fields empty
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "student"
    });

    await newUser.save();

    res.json({
      message: "Account created successfully"
    });

  } catch (error) {

  console.error(error);

  // Duplicate email error
  if (error.code === 11000) {
    return res.status(400).json({
      message: "Email already registered"
    });
  }

  res.status(500).json({
    message: "Server error"
  });

}

});

router.post("/login", async (req, res) => {

try {

const { email, password } = req.body;

/* FIND USER */

const user = await User.findOne({ email });

if (!user) {
return res.status(400).json({
message: "Invalid email or password"
});
}

/* CHECK PASSWORD */

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
return res.status(400).json({
message: "Invalid email or password"
});
}

/* GENERATE TOKEN */

const token = jwt.sign(
{ id: user._id, role: user.role },
"nerdysecretkey",
{ expiresIn: "7d" }
);

/* SEND RESPONSE */

res.json({
message: "Login successful",
token,
user:{
name: user.name,
email: user.email,
role: user.role
}
});

} catch (error) {

res.status(500).json({
message: "Server error"
});

}

});


module.exports = router;