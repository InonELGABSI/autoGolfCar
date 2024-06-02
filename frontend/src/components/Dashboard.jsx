import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mapview } from './Mapview';

export const Dashboard = () => {
  const [carData, setCarData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/cars')
      .then(response => setCarData(response.data))
      .catch(error => console.error('There was an error fetching the car data!', error));
  }, []);

  return (
    <div>
      <h1>Car Dashboard</h1>
      <Mapview carData={carData} />
    </div>
  );
};


