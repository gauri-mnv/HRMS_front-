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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8006";
export default function SignInPage() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  // 
  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      setError('');

      const res = await axios.post(
        `${API_URL}/auth/signin`,
        { email, password }
      );

      const { access_token, user } = res.data;
      const role = user.role;

      // THIS IS FOR LOCAL STORAGE
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // ROLE-BASED REDIRECT
      if (
        role === 'ADMIN' ||
        role === 'FOUNDER' ||
        role === 'COFOUNDER'
      ) {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };




  // 
  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Sign In
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
          onClick={handleSignIn}
        >
          Login
        </Button>
      </Box>

       {/* Divider.... g*/}
      <Divider sx={{ my: 3 }} />

      {/* Signup link.....g */}
      <Typography variant="body2" align="center">
        Don&apos;t have an account?{' '}
        <Link
          component="button"
          onClick={() => router.push('/auth/signup')}
          underline="hover"
        >
          Sign up
        </Link>
      </Typography>
    </Container>
  );
}
