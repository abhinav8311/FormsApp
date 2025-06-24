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

function Home() {
  const handleCreateGoogleForm = async () => {
    const token = localStorage.getItem('googleAccessToken');
    if (!token) {
      alert('Please sign in with Google to create a form');
      return;
    }

    try {
      // Step 1: Create the form
      const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          info: {
            title: 'Untitled Form',
            documentTitle: 'Untitled Form',
          },
        }),
      });

      if (!createRes.ok) {
        const errorText = await createRes.text();
        console.error('❌ Form creation failed:', errorText);
        alert('API Error: ' + errorText);
        return;
      }

      const createdForm = await createRes.json();
      console.log('✅ Created Form:', createdForm);

      const formId = createdForm.formId;
      if (!formId) {
        alert('Form creation failed. No form ID received.');
        return;
      }

      // Step 2: Add a default question (required for responder link to work)
      const batchUpdateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              createItem: {
                item: {
                  title: 'What is your name?',
                  questionItem: {
                    question: {
                      required: true,
                      textQuestion: {},
                    },
                  },
                },
                location: {
                  index: 0,
                },
              },
            },
          ],
        }),
      });

      const updateData = await batchUpdateRes.json();
      console.log('✏️ Question added:', updateData);

      // Step 3: Manually open the responder link
      const formUrl = `https://docs.google.com/forms/d/${formId}/viewform`;
      window.open(formUrl, '_blank');
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('Something went wrong while creating the form.');
    }
  };

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
              onClick={handleCreateGoogleForm}
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
