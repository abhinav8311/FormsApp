import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider , CssBaseline} from '@mui/material';
import theme from './theme.js'; // Assuming you have a theme.js file for MUI theme

const clientId = "1032405387293-tsfd26a59st8ktp5kd6mgu7ql6daa4v1.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
