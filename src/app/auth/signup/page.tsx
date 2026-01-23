'use client';

import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Divider,
  Link,
} from '@mui/material';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
//   const [role, setRole] = useState('');
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8006";

  // 
  const handleSignUp = async () => {
    try {
        setError('');

      await axios.post(
        // 'http://localhost:8006/auth/signup',
        `${API_URL}/auth/signup`,
        {   email, 
            password ,
            roleName: 'EMPLOYEE', // or FOUNDER / CO_FOUNDER
        }
      );

      
        router.push('/signin');
      } catch (err: any) {
        if (err.response?.status === 409) {
          setError('Email already registered. Please login.');
        } else {
          setError('Signup failed. Please try again.');
        }
      }
  };

  // 
  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>

      <Box component="form">
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange = {
            (e) =>setEmail(e.target.value)
          }
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange = {
            (e) =>setPassword(e.target.value)
          }
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSignUp}
        >
          signUp
        </Button>
      </Box>

       {/* Divider.... g*/}
      <Divider sx={{ my: 3 }} />

      {/* signin link.....g */}
      <Typography variant="body2" align="center">
            Already have an account?{' '}
        <Link
          component="button"
          onClick={() => router.push('/auth/signin')}
          underline="hover"
        >
         Login
        </Link>
      </Typography>
    </Container>
  );
}
