// src/components/GoogleSignIn.jsx
import { Button } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export default function GoogleSignIn() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: 'implicit',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/forms.body',
      'https://www.googleapis.com/auth/forms.responses.readonly'
    ].join(' '),
    onSuccess: (tokenResponse) => {
      console.log('✅ Access Token:', tokenResponse.access_token);
      localStorage.setItem('googleAccessToken', tokenResponse.access_token);
      navigate('/home');
    },
    onError: () => {
      alert('Google login failed');
    },
  });

  return (
    <Button onClick={() => login()} fullWidth variant="outlined">
      Sign in with Google
    </Button>
  );
}
