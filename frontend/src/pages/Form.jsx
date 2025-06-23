import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Button,
    Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Select, MenuItem } from '@mui/material';

const FormBuilder = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { id: Date.now(), label: '', type: 'text', options: [] }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { id: Date.now(), label: '', type: 'text', options: [] }]);
    };

    const updateQuestion = (id, newLabel) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, label: newLabel } : q
        ));
    };
    const updateQuestionType = (id, newType) => {
        setQuestions(questions.map(q =>
            q.id === id
                ? { ...q, type: newType, options: newType === 'mcq' ? [''] : [] }
                : q
        ));
    };
    const updateOption = (qid, optIndex, newValue) => {
        setQuestions(questions.map(q =>
            q.id === qid
                ? {
                    ...q,
                    options: q.options.map((opt, i) =>
                        i === optIndex ? newValue : opt
                    )
                }
                : q
        ));
    };

    const addOption = (qid) => {
        setQuestions(questions.map(q =>
            q.id === qid
                ? { ...q, options: [...q.options, ''] }
                : q
        ));
    };



    return (
        <Box p={4}>
            {/* Form Title + Description */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Form Title"
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    sx={{ fontSize: 24, fontWeight: 'bold', mb: 1 }}
                />
                <TextField
                    fullWidth
                    placeholder="Form Description"
                    variant="standard"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputProps={{ disableUnderline: true }}
                />
            </Paper>

            {/* Questions */}
            {questions.map((q, index) => (
                <Paper key={q.id} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1">Question {index + 1}</Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter your question"
                        variant="outlined"
                        value={q.label}
                        onChange={(e) => updateQuestion(q.id, e.target.value)}
                        sx={{ mt: 1 }}
                    />
                    <Select
                        fullWidth
                        value={q.type}
                        onChange={(e) => updateQuestionType(q.id, e.target.value)}
                        sx={{ mt: 1 }}
                    >
                        <MenuItem value="text">Short Answer</MenuItem>
                        <MenuItem value="mcq">Multiple Choice</MenuItem>
                    </Select>

                    {q.type === 'mcq' && (
                        <>
                            {q.options.map((option, optIndex) => (
                                <TextField
                                    key={optIndex}
                                    fullWidth
                                    placeholder={`Option ${optIndex + 1}`}
                                    value={option}
                                    onChange={(e) =>
                                        updateOption(q.id, optIndex, e.target.value)
                                    }
                                    sx={{ mt: 1 }}
                                />
                            ))}

                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => addOption(q.id)}
                                sx={{ mt: 1 }}
                            >
                                + Add Option
                            </Button>
                        </>
                    )}


                </Paper>
            ))}

            {/* Add Question */}
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addQuestion}
                sx={{ mt: 2 }}
            >
                Add Question
            </Button>
        </Box>
    );
};

export default FormBuilder;
