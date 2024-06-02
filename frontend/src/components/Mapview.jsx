import React from 'react';
import { GoogleMap, LoadScript, Marker as AdvancedMarkerElement } from '@react-google-maps/api';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 32.100299,
  lng: 34.814297
};

export const Mapview = ({ carData }) => {
  return (
    <LoadScript 
    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
    loading="async" 
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        {carData && carData.map((car, index) => (
        <AdvancedMarkerElement
        key={index}
        position={{ lat: car.location[0], lng: car.location[1] }}
        />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};
