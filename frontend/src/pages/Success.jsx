import React from 'react';
import { Box, Typography, IconButton, Container, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function Success() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8, position: 'relative' }}>
        <IconButton
          onClick={() => navigate('/login')}
          sx={{ position: 'absolute', top: 8, left: 8 }}
          aria-label="Back to Login"
        >
          <ArrowBackIcon />
        </IconButton>

        <Box textAlign="center" mt={4}>
          <Typography variant="h5" gutterBottom>
             Successfully Registered!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please log in to continue.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Success;
