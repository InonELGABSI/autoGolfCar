import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { Mapview } from '../Mapview'; // Import your Mapview component

export const Dashboard = () => {
  const [carData, setCarData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/cars')
      .then(response => setCarData(response.data))
      .catch(error => console.error('There was an error fetching the car data!', error));
  }, []);

  return (
    <Container className="dashboard">  {/* Apply custom CSS class for styling (optional) */}
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Card >  {/* Set minimum height for full viewport coverage */}
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h1" component="h1">
                Car Dashboard
              </Typography>
              <Mapview carData={carData} />
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Container>
  );
};
