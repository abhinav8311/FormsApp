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
import { useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const hideUserInfo =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        m: 0,
        p: 0,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          boxShadow: '0 4px 24px 0 rgba(60,72,100,0.10)',
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
          px: { xs: 1, sm: 3, md: 6 },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            height: 72,
            minHeight: 72,
            px: 0,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <img src="/vite.svg" alt="logo" style={{ height: 36, marginRight: 8 }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#fff', cursor: hideUserInfo ? 'default' : 'pointer', userSelect: 'none', letterSpacing: '-1px' }}
              onClick={() => {
                if (!hideUserInfo) navigate('/home');
              }}
            >
              Forms Manager
            </Typography>
          </Stack>

          {!hideUserInfo && currentUser && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                {currentUser.name}
              </Typography>
              <Avatar
                src={currentUser.picture}
                alt={currentUser.name}
                sx={{ width: 40, height: 40, border: '2px solid #fff', boxShadow: '0 2px 8px 0 rgba(60,72,100,0.10)' }}
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
          p: { xs: 1, sm: 2, md: 3 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          m: 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'transparent',
            width: '100%',
            maxWidth: '1200px',
            minHeight: '80vh',
            p: { xs: 0, sm: 2, md: 3 },
            boxShadow: 'none',
            borderRadius: 0,
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
