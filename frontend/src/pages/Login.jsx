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
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f4f6fb"
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={4}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        boxShadow:
                            '0 2px 16px 0 rgba(60,72,100,0.09)',
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color="primary.main"
                        align="center"
                        mb={2}
                    >
                        Login
                    </Typography>
                    {loginError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {loginError}
                        </Alert>
                    )}
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
                                    sx={{
                                        bgcolor: '#fff',
                                        borderRadius: 2,
                                    }}
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
                                    sx={{
                                        bgcolor: '#fff',
                                        borderRadius: 2,
                                    }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        py: 1.2,
                                        fontSize: 18,
                                    }}
                                >
                                    Login
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <Box my={2} textAlign="center">
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            or
                        </Typography>
                    </Box>
                    <GoogleSignInButton />
                    <Box mt={3} textAlign="center">
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={() => navigate('/register')}
                                sx={{ fontWeight: 600 }}
                            >
                                Register
                            </Button>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Login;
// This code is a React component for a login page that includes both email/password login and Google OAuth login.