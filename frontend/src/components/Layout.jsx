import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Stack,
  Box,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const hideUserInfo =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#dda15e',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#dda15e' }}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
            Forms Manager
          </Typography>

          {!hideUserInfo && currentUser && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ color: '#fff' }}>
                {currentUser.name}
              </Typography>
              <Avatar
                src={currentUser.picture}
                alt={currentUser.name}
              />
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            bgcolor: '#fefae0',
            width: '90vw',         // ✅ 90% of viewport width
            maxWidth: '1400px',    // ✅ safe upper limit on large screens
            minHeight: '80vh',
            p: 4,
            borderRadius: 2,
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
