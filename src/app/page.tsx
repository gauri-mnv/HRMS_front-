'use client';

import { Button, Container, Typography, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        WELCOME TO HRMS 
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Manage employees, attendance, payroll and more
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() => router.push('/auth/signin')}
        >
          Sign In
        </Button>

        <Button
          variant="outlined"
          onClick={() => router.push('/auth/signup')}
        >
          Sign Up
        </Button>
      </Stack>
    </Container>
  );
}
