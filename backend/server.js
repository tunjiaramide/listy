const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require("./routes/users");
const propertyRoutes = require('./routes/properties');
const videoRoutes = require('./routes/video');

const cors = require('cors');

const app = express();
const port = 5000;

require('dotenv').config()

// MongoDB connection string
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the server after successful connection to MongoDB
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


// Middleware to parse JSON and URL-encoded data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api', (req, res) => {
  res.send('Hello, World!');
});


// User Routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/videos', videoRoutes);
