const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const authenticate = require('../middleware/authenticate');

// Get all properties for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const properties = await Property.find({ user: req.userId }).populate('user', 'name');
    res.json(properties);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a single property
router.get('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('user', 'name');
    if (!property) {
      return res.status(404).send('Property not found');
    }

    const propertyUserId = property.user._id.toString();
    const authenticatedUserId = req.userId;

    if (propertyUserId !== authenticatedUserId) {
      return res.status(403).send('Unauthorized');
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error.message);
    res.status(500).send(error.message);
  }
});


// Create a new property
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;
    const property = new Property({ title, description, videoUrl, user: req.userId });
    await property.save();
    res.status(201).send('Property created');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Update a property
router.put('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).send('Property not found');
    if (property.user.toString() !== req.userId) return res.status(403).send('Unauthorized');
    const { title, description, videoUrl } = req.body;
    property.title = title || property.title;
    property.description = description || property.description;
    property.videoUrl = videoUrl || property.videoUrl;
    await property.save();
    res.send('Property updated');
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// Delete a property
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).send('Property not found');
    if (property.user.toString() !== req.userId) return res.status(403).send('Unauthorized');
    
    await Property.deleteOne({ _id: req.params.id });
    res.send('Property deleted');
  } catch (error) {
    res.status(400).send(error.message);
  }
});


module.exports = router;
