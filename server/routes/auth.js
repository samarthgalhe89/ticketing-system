// server/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Staff = require("../models/staff");
const Admin = require("../models/admin");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Look for the user in all three collections
    let user =
      (await User.findOne({ email })) ||
      (await Staff.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // 3. Create token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // 4. Send token + role
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during login");
  }
});

module.exports = router;
