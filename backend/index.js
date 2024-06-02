// Import necessary modules
import express from 'express';
import mongoose, { Mongoose } from 'mongoose';
import cors from 'cors';
import carRoutes from './routes/carRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import Car from './models/Car.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const mongoURI=process.env.MONGO_URI;
// Create an Express app
const app = express();
const port = 3000;

// Configure middleware
app.use(cors({
  origin: 'http://localhost:5173' // Replace with your frontend URL
}));
app.use(express.json());
app.use('/cars', carRoutes);
app.use('/navigation', carRoutes);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to DB'));

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('New client connected');

  setInterval(async () => {
    try {
      const carIds = await Car.find({}); // Fetch car IDs from your model
      const response = await axios.post('http://localhost:8080/locate', { carIds });
      socket.emit('carData', response.data);
    } catch (error) {
      console.error('Error updating MongoDB:', error);
    }
  }, 1000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the HTTP server
httpServer.listen(port, () => console.log(`Server running on port ${port}`));
