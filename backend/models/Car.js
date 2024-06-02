import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  location: {
    type: [Number],
    required: true
  },
  speed: {
    type: Number,
    required: true
  },
  battery: {
    type: Number,
    required: true
  }
});

const Car = mongoose.model('Car', CarSchema);

export default Car;
