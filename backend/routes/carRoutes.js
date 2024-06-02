import express from 'express';
import Car from '../models/Car.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post('/', async (req, res) => {
  const car = new Car({
    name: req.body.name,
    model: req.body.model,
    status: req.body.status,
    location: req.body.location,
    speed: req.body.speed,
    battery: req.body.battery
  });
  try {
    const savedCar = await car.save();
    res.json(savedCar);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get('/:carId', async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    res.json(car);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete('/:carId', async (req, res) => {
  try {
    const removedCar = await Car.remove({ _id: req.params.carId });
    res.json(removedCar);
  } catch (err) {
    res.json({ message: err });
  }
});

router.patch('/:carId', async (req, res) => {
  try {
    const updatedCar = await Car.updateOne(
      { _id: req.params.carId },
      { $set: req.body }
    );
    res.json(updatedCar);
  } catch (err) {
    res.json({ message: err });
  }
});

export default router;
