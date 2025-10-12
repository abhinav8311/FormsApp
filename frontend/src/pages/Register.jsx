import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignIn';

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = (values) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(values);
    localStorage.setItem('users', JSON.stringify(users));
    navigate('/success');
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f4f6fb">
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: '0 2px 16px 0 rgba(60,72,100,0.09)' }}>
          <Typography variant="h4" fontWeight={700} color="primary.main" align="center" mb={2}>
            Register
          </Typography>
          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  margin="normal"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ bgcolor: '#fff', borderRadius: 2 }}
                />
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
                  sx={{ bgcolor: '#fff', borderRadius: 2 }}
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
                  sx={{ bgcolor: '#fff', borderRadius: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3, mb: 2, fontWeight: 600, borderRadius: 2, py: 1.2, fontSize: 18 }}
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
          <Box my={2} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              or
            </Typography>
          </Box>
          <GoogleSignInButton />
          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Button variant="text" color="secondary" onClick={() => navigate('/login')} sx={{ fontWeight: 600 }}>
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
