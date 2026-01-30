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
const API_URL = process.env.NEXT_PUBLIC_API_URL ||"http://localhost:8006";

export default function SignInPage() {

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading,setLoading ] = useState(false);


  // 
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isValidPassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      setError('');
      if (!isValidEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
  
      if (!password) {
        setError('Password is required.');
        return;
      }
      // setLoading(true);
      console.log(email, password)
      try {
      const res = await axios.post(
        `${API_URL}/auth/signin`,
        { email, password }
      );
      //console.log(email, password)
      const {accessToken, refreshToken, user  } = res.data.data;
      console.log("res", accessToken, refreshToken, "user", user);

      // THIS IS FOR LOCAL STORAGE
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
        console.error('Access token or refresh token not found in local storage');
        setError('Access token or refresh token not found.');
        return;
      }
      // Check if user object is present in local storage
      if (!localStorage.getItem('user')) {
        console.error('User object not found in local storage');
        setError('User object not found.');
        return;
      }
      if (!user || !user.role) {
        console.error('Role property not found in user object', res.data);
        setError('Role property not found.');
         return;
      } 


    // console.log(access_token);
    //     console.log(user);
    //         console.log(refresh_token);

      const role = user.role.name;
      // ROLE-BASED REDIRECT
      if (['ADMIN','FOUNDER','COFOUNDER'].includes(role)) { 
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    } catch (err:any) {
      console.error( err);
      setError(err?.response?.data?.message || 'Invalid email or password.');
      // setLoading(false);
    }}catch (err: any) {
      console.error('Error', err);
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
          // type="password"
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
 