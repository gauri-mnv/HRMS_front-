'use client';

import Navbar from '@/components/common/Navbar';
import { Container, Typography } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Container sx={{ mt: 5 }}>
           <Navbar />
           
      <Typography variant="h4" fontWeight="bold">
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary">
        Manage employees, roles and organization
      </Typography>
    </Container>
  );
}
