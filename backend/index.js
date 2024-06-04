import express from 'express';
import mongoose, { Mongoose } from 'mongoose';
import cors from 'cors';
import carRoutes from './routes/carRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import Car from './models/Car.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI=process.env.MONGO_URI;
const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173' 
}));
app.use(express.json());
app.use('/cars', carRoutes);
app.use('/navigation', carRoutes);


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to DB'));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  setInterval(async () => {
    try {
      const carIds = await Car.find({}); 
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

httpServer.listen(port, () => console.log(`Server running on port ${port}`));
