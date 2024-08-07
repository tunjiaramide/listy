const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config()


// Register
router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validate the input
      if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({ name, email, password: hashedPassword });
  
      // Save the user to the database
      await user.save();
  
      // Respond with success
      res.status(201).send('User registered');
    } catch (error) {
      res.status(400).send(error.message);
    }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the input
    if (!email || !password) {
        return res.status(400).send('Email, and password are required');
      }

    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token });
    
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
