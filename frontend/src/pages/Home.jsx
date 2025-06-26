// src/pages/Home.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Box p={4}>
      {/* Start New Form */}
      <Typography variant="h6" gutterBottom align="center">
        Start a new form
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: 150 }}>
            <CardActionArea
              sx={{ height: '100%' }}
              onClick={() => navigate('/formbuilder')} // ✅ new route
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h3" color="primary">
                  +
                </Typography>
                <Typography variant="body2">Blank Form</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* (Optional) Saved Forms Section */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Your Forms
        </Typography>
        <Grid container spacing={2}>
          {/* You can dynamically show saved form cards here later */}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
