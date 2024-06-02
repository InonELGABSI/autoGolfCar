import express from 'express';
import axios from 'axios';
const router = express.Router();

// POST a new car
router.post('/', async (req, res) => {
  try {
    // Extract coordinates data from the request body
    const { coordinates } = req.body;

    // Convert coordinates data to the format expected by the Python service
    const formattedCoordinates = coordinates.map(coord => ({ x: coord[0], y: coord[1] }));

    // Send a POST request to the Python service route '/optimize-route'
    const response = await axios.post('http://localhost:5001/optimize-route', { coordinates: formattedCoordinates });

    // Send the response from the Python service back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error optimizing route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
