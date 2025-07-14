import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Card,
  CardContent,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SortIcon from '@mui/icons-material/Sort';
import DeleteIcon from '@mui/icons-material/Delete';
// Firestore imports
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

// Debounce utility: delays function execution until user stops typing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const sortOptions = [
  { label: 'Older to Newer', value: 'oldest' },
  { label: 'Newer to Older', value: 'newest' },
  { label: 'Most to Least Response', value: 'most' },
  { label: 'Least to Most Response', value: 'least' },
];

const Home = () => {
  const navigate = useNavigate();
  const [createdForms, setCreatedForms] = useState([]);
  const [responses, setResponses] = useState({}); // Stores responses for each form
  const [search, setSearch] = useState(''); // Search input value
  const [sort, setSort] = useState('newest'); // Default sort
  const [anchorEl, setAnchorEl] = useState(null); // For sort menu
  const token = localStorage.getItem('googleAccessToken');

  // Debounced search value
  const debouncedSearch = useDebounce(search, 300);

  // Fetch forms from Firestore on mount
  useEffect(() => {
    const fetchForms = async () => {
      const querySnapshot = await getDocs(collection(db, 'forms'));
      const forms = [];
      querySnapshot.forEach((docSnap) => {
        forms.push({ ...docSnap.data(), docId: docSnap.id });
      });
      setCreatedForms(forms);
    };
    fetchForms();
  }, []);

  // Fetch responses for all forms (for sorting by response count)
  useEffect(() => {
    createdForms.forEach((form) => {
      if (!responses[form.id]) fetchResponses(form.id);
    });
    // eslint-disable-next-line
  }, [createdForms]);

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
      if (!res.ok) throw new Error('Failed to fetch responses');
      const data = await res.json();
      setResponses((prev) => ({ ...prev, [formId]: data.responses || [] }));
    } catch (err) {
      console.error('Error fetching responses:', err);
    }
  };

  // Filter and sort forms based on search and sort option
  const filteredForms = useMemo(() => {
    let forms = createdForms.filter((form) =>
      form.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    switch (sort) {
      case 'oldest':
        forms = forms.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        break;
      case 'newest':
        forms = forms.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
      case 'most':
        forms = forms.slice().sort((a, b) => (responses[b.id]?.length || 0) - (responses[a.id]?.length || 0));
        break;
      case 'least':
        forms = forms.slice().sort((a, b) => (responses[a.id]?.length || 0) - (responses[b.id]?.length || 0));
        break;
      default:
        break;
    }
    return forms;
  }, [createdForms, debouncedSearch, sort, responses]);

  // Handlers for sort menu
  const handleSortClick = (event) => setAnchorEl(event.currentTarget);
  const handleSortClose = () => setAnchorEl(null);
  const handleSortSelect = (value) => {
    setSort(value);
    setAnchorEl(null);
  };

  // Delete a form from Firestore
  const handleDeleteForm = async (docId) => {
    await deleteDoc(doc(db, 'forms', docId));
    setCreatedForms((prev) => prev.filter((form) => form.docId !== docId));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      {/* Search and Sort Controls */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        {/* Search Field with Debouncing */}
        <TextField
          label="Search forms"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled>
                  {/* You can add a search icon here if you want */}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        {/* Sort Button */}
        <Button
          variant="outlined"
          startIcon={<SortIcon />}
          onClick={handleSortClick}
        >
          Sort
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSortClose}>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={sort === option.value}
              onClick={() => handleSortSelect(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

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
        {filteredForms.length === 0 ? (
          <Typography>No forms found.</Typography>
        ) : (
          filteredForms.map((form) => (
            <Grid item key={form.docId} xs={12} sm={6} md={4}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {form.title}
                    </Typography>
                    {/* Delete Button */}
                    <IconButton color="error" onClick={() => handleDeleteForm(form.docId)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
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
                  <Typography variant="caption" display="block" mt={1}>
                    Created: {form.createdAt ? new Date(form.createdAt).toLocaleString() : 'Unknown'}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Responses: {responses[form.id]?.length || 0}
                  </Typography>
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
