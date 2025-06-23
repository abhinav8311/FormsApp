import React, {useState} from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../firebase';
import googleLogo from '../images/google.png';

export default function GoogleSignInButton() {
    const navigate=useNavigate();
    const [error, setError] = useState('');

    const handleClick= async()=>{
        setError('');
        try {
            const result = await signInWithGoogle();
            console.log("Signed In", result.user);
            navigate('/home');
        } catch (err) {
            console.error(err);
            setError('Google Sign In Failed');
        }
    };

    return(
        <div style={{ textAlign: 'center', marginTop: '16x' }}>
            <img
                src={googleLogo}
                alt="Sign In with Google"
                onClick={handleClick}
                style={{ cursor: 'pointer', maxWidth: '240px', width: '100%' }}
            />
            {error && (
                <Typography variant="body2" color="error" mt={1}>
                    {error}
                </Typography>
            )}

        </div>
    );
}