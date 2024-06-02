import express from 'express';
import axios from 'axios';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { coordinates } = req.body;

    const formattedCoordinates = coordinates.map(coord => ({ x: coord[0], y: coord[1] }));

    const response = await axios.post('http://localhost:5001/optimize-route', { coordinates: formattedCoordinates });

    res.json(response.data);
  } catch (error) {
    console.error('Error optimizing route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
