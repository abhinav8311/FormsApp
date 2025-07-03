import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [createdForms, setCreatedForms] = useState([]);
  const [responses, setResponses] = useState({}); // Stores responses for each form
  const token = localStorage.getItem('googleAccessToken');

  // Load created forms from localStorage on page load
  useEffect(() => {
    const forms = JSON.parse(localStorage.getItem('createdForms')) || [];
    setCreatedForms(forms);
  }, []);

  // Handles navigation to form builder when "Blank Form" is clicked
  const handleCreateNewForm = () => {
    navigate('/formbuilder');
  };

  // Fetch responses using Forms API
  const fetchResponses = async (formId) => {
    try {
      const res = await fetch(
        `https://forms.googleapis.com/v1/forms/${formId}/responses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch responses');
      }

      const data = await res.json();
      setResponses((prev) => ({
        ...prev,
        [formId]: data.responses || [],
      }));
    } catch (err) {
      console.error('Error fetching responses:', err);
      alert('Unable to fetch responses. Check your access token or scopes.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      {/* Section for creating a blank form */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Start a New Form
      </Typography>

      <Grid container spacing={2} mt={1} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            onClick={handleCreateNewForm}
            sx={{
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              bgcolor: '#fefae0',
              border: '2px dashed #dda15e',
            }}
          >
            <Typography fontWeight="bold">+ Blank Form</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Section to list already created forms */}
      <Typography variant="h6" sx={{ mt: 6 }}>
        Your Forms
      </Typography>

      <Grid container spacing={2} mt={1}>
        {createdForms.length === 0 ? (
          <Typography>No forms yet.</Typography>
        ) : (
          createdForms.map((form) => (
            <Grid item key={form.id} xs={12} sm={6} md={4}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {form.title}
                  </Typography>

                  {/* View Form button */}
                  <Box mt={1}>
                    <a
                      href={`https://docs.google.com/forms/d/${form.id}/viewform`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Form
                    </a>
                  </Box>

                 <Button
  size="small"
  variant="outlined"
  sx={{ mt: 1 }}
  onClick={() => navigate(`/responses/${form.id}`)}
>
  View Responses
</Button>

                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Home;
