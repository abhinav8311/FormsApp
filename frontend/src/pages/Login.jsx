import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Alert,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignIn'; // ✅ renamed from GoogleSignInButton to match the correct file

function Login() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    // ✅ Validation schema using Yup
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    // ✅ Formik form submit handler
    const handleSubmit = (values) => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const found = users.find(
            (user) =>
                user.email === values.email && user.password === values.password
        );

        if (found) {
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('currentUser', JSON.stringify(found));
            navigate('/main');
        } else {
            setLoginError('Invalid email or password');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>

                {/* 🔴 Show login error if incorrect credentials */}
                {loginError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {loginError}
                    </Alert>
                )}

                {/* ✅ Email/password login form */}
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                margin="normal"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                margin="normal"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />

                            <Box mt={3}>
                                <Button type="submit" variant="contained" fullWidth>
                                    Login
                                </Button>
                            </Box>

                            <Box mt={2} textAlign="center">
                                <Typography variant="body2">
                                    Not registered?{' '}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="primary"
                                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => navigate('/register')}
                                    >
                                        Sign Up
                                    </Typography>
                                </Typography>
                            </Box>

                            {/* ✅ OR Google OAuth Login */}
                            <Box mt={4}>
                                <Typography align="center" mb={1}>
                                    — or —
                                </Typography>
                                <GoogleSignInButton />
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
}

export default Login;
// This code is a React component for a login page that includes both email/password login and Google OAuth login.