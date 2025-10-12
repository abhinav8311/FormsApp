import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

function FormBuilder() {
  const [title, setTitle] = useState('Untitled Form');
  const [questions, setQuestions] = useState([
    { type: 'text', label: '', options: [''] , required: false},
  ]);

  const [showPreview, setShowPreview] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { type: 'text', label: '', options: [''], required: false },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, key, value) => {
    const updated = [...questions];
    updated[index][key] = value;

    if (key === 'type') {
      if (value === 'text') updated[index].options = [''];
      if (['mcq', 'checkbox', 'dropdown'].includes(value) && !updated[index].options) {
        updated[index].options = [''];
      }
    }

    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const handlePublishToGoogleForm = async () => {
    const token = localStorage.getItem('googleAccessToken');
    if (!token) {
      alert('Please sign in with Google');
      return;
    }

    const hasEmptyRequired = questions.some((q, i) => {
  if (!q.required) return false;

  const labelEmpty = !q.label || q.label.trim() === '';
  const hasChoices = ['mcq', 'checkbox', 'dropdown'].includes(q.type)
    ? (q.options || []).filter(opt => opt.trim()).length === 0
    : false;

  return labelEmpty || hasChoices;
});

if (hasEmptyRequired) {
  alert('Some required questions are incomplete. Please fill all required labels and options.');
  return;
}


    try {
      // Step 1: Create form

      const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
        method: 'POST',
        headers:
         {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          info: {
            title: title || 'Untitled Form',
            documentTitle: title || 'Untitled Form',
          },
        }),
      });


      // Save form to Firestore instead of localStorage
      const saveFormToFirestore = async (formId, title) => {
        try {
          await addDoc(collection(db, 'forms'), {
            id: formId,
            title,
            createdAt: Date.now(),
          });
        } catch (err) {
          console.error('Error saving form to Firestore:', err);
        }
      };


      if (!createRes.ok) {
        const error = await createRes.text();
        console.error('❌ Form creation failed:', error);
        alert('Form creation failed');
        return;
      }

      const createdForm = await createRes.json();
      const formId = createdForm.formId;
      await saveFormToFirestore(formId, title || 'Untitled Form');


      // Step 2: Generate valid batchUpdate requests
      const requests = questions
        .map((q, index) => {
          if (!q.label || q.label.trim() === '') {
            console.warn(`⚠️ Skipping empty question ${index + 1}`);
            return null;
          }

          const item = {
            createItem: {
              item: {
                title: q.label.trim(),
                questionItem: {
                  question: {
                    required: q.required || false,
                  },
                },
              },
              location: { index },
            },
          };

          if (q.type === 'text') {
            item.createItem.item.questionItem.question.textQuestion = {};
          } else if (['mcq', 'checkbox', 'dropdown'].includes(q.type)) {
            const cleanedOptions = (q.options || [])
              .map((opt) => opt.trim())
              .filter((opt) => opt.length > 0)
              .map((opt) => ({ value: opt }));

            if (cleanedOptions.length === 0) {
              console.warn(`⚠️ Skipping question ${index + 1}: No valid options`);
              return null;
            }

            let choiceType = 'RADIO';
            if (q.type === 'checkbox') choiceType = 'CHECKBOX';
            if (q.type === 'dropdown') choiceType = 'DROP_DOWN';

            item.createItem.item.questionItem.question.choiceQuestion = {
              type: choiceType,
              options: cleanedOptions,
              shuffle: false,
            };
          }

          return item;
        })
        .filter(Boolean); // remove null entries

      console.log('📤 Sending batchUpdate:', requests);

      // Step 3: Send batchUpdate
      const batchRes = await fetch(
        `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requests }),
        }
      );

      const batchData = await batchRes.json();
      if (!batchRes.ok) {
        console.error('❌ Batch update failed:', batchData);
        alert('Failed to add questions');
        return;
      }

      console.log('📦 Questions added:', batchData);

      // Step 4: Open form
      const formUrl = `https://docs.google.com/forms/d/${formId}/viewform`;
      window.open(formUrl, '_blank');
    } catch (err) {
      console.error('❌ Error publishing form:', err);
      alert('Something went wrong while publishing.');
    }
  };

  return (
    <Box maxWidth="md" mx="auto" p={{ xs: 1, sm: 3, md: 5 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, mb: 4, boxShadow: '0 2px 16px 0 rgba(60,72,100,0.09)' }}>
        <Typography variant="h4" fontWeight={700} mb={2} color="primary.main">
          Form Builder
        </Typography>
        <TextField
          fullWidth
          label="Form Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 4, bgcolor: '#f4f6fb', borderRadius: 2 }}
        />
        {questions.map((q, qIndex) => (
          <Paper key={qIndex} elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 3, bgcolor: '#f8fafc', boxShadow: '0 1px 6px 0 rgba(60,72,100,0.06)' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label={`Question ${qIndex + 1}`}
                  value={q.label}
                  onChange={(e) => handleQuestionChange(qIndex, 'label', e.target.value)}
                  sx={{ bgcolor: '#fff', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  value={q.type}
                  onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                  sx={{ bgcolor: '#fff', borderRadius: 2 }}
                >
                  <MenuItem value="text">Short Answer</MenuItem>
                  <MenuItem value="mcq">Multiple Choice</MenuItem>
                  <MenuItem value="checkbox">Checkboxes</MenuItem>
                  <MenuItem value="dropdown">Dropdown</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={q.required}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIndex].required = e.target.checked;
                        setQuestions(updated);
                      }}
                    />
                  }
                  label="Required"
                  sx={{ ml: 1 }}
                />
              </Grid>
              {['mcq', 'checkbox', 'dropdown'].includes(q.type) &&
                q.options.map((opt, oIndex) => (
                  <Grid item xs={12} key={oIndex}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField
                        fullWidth
                        label={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        sx={{ bgcolor: '#fff', borderRadius: 2 }}
                      />
                      <IconButton
                        onClick={() => handleRemoveOption(qIndex, oIndex)}
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              {['mcq', 'checkbox', 'dropdown'].includes(q.type) && (
                <Grid item xs={12}>
                  <Button
                    onClick={() => handleAddOption(qIndex)}
                    startIcon={<AddCircleOutlineIcon />}
                    variant="outlined"
                    color="secondary"
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                  >
                    Add Option
                  </Button>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveQuestion(qIndex)}
                  startIcon={<DeleteIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Remove Question
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Box display="flex" gap={2} mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddQuestion}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Add Question
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handlePublishToGoogleForm}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Publish to Google Forms
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowPreview(!showPreview)}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            {showPreview ? 'Hide Preview' : 'Preview Form'}
          </Button>
        </Box>
      </Paper>
      {showPreview && (
        <Box mt={5}>
          <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
            🔎 Form Preview
          </Typography>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc', boxShadow: '0 1px 6px 0 rgba(60,72,100,0.06)' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {title || 'Untitled Form'}
            </Typography>
            {questions.map((q, index) => (
              <Box key={index} mb={3}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {index + 1}. {q.label || '(No Question Text)'}
                </Typography>
                {q.type === 'text' && (
                  <TextField fullWidth placeholder="Short answer" disabled sx={{ mt: 1, bgcolor: '#fff', borderRadius: 2 }} />
                )}
                {['mcq', 'checkbox', 'dropdown'].includes(q.type) && (
                  <Box mt={1}>
                    {q.type === 'dropdown' ? (
                      <TextField select fullWidth disabled sx={{ bgcolor: '#fff', borderRadius: 2 }}>
                        {q.options.map((opt, i) => (
                          <MenuItem key={i} value={opt}>{opt}</MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      q.options.map((opt, i) => (
                        <Box key={i} display="flex" alignItems="center" gap={1}>
                          <input
                            type={q.type === 'mcq' ? 'radio' : 'checkbox'}
                            disabled
                            name={`q${index}`}
                            style={{ accentColor: '#3f51b5' }}
                          />
                          <Typography>{opt}</Typography>
                        </Box>
                      ))
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default FormBuilder;
