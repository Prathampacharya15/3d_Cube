const express = require('express');
const router = express.Router();
const Cube = require('../models/Cube');

// GET cube data by ID (if not found, create default)
router.get('/:id', async (req, res) => {
  try {
    const cube = await Cube.findOne({ cubeId: req.params.id });
    
    // If cube not found, create with default values
    if (!cube) {
      const defaultCube = await Cube.create({
        cubeId: req.params.id,
        position: { x: 0, y: 0, z: 0 },
        rotationSpeed: 0.01,
        lastSaved: new Date()
      });
      return res.json(defaultCube);
    }

    // Send found cube
    res.json(cube);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save cube position and rotation speed
router.post('/:id/save', async (req, res) => {
  try {
    const { position, rotationSpeed } = req.body;

    // Update existing or create new cube
    const cube = await Cube.findOneAndUpdate(
      { cubeId: req.params.id },
      {
        position,
        rotationSpeed,
        lastSaved: new Date(),
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json(cube);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset cube to default position and speed
router.post('/:id/reset', async (req, res) => {
  try {
    const defaultData = {
      position: { x: 0, y: 0, z: 0 },
      rotationSpeed: 0.01,
      lastSaved: new Date(),
      updatedAt: new Date()
    };

    const cube = await Cube.findOneAndUpdate(
      { cubeId: req.params.id },
      defaultData,
      { new: true, upsert: true }
    );

    res.json(cube);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
