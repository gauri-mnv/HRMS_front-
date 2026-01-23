'use client';

import { Container, Typography } from '@mui/material';
import Navbar from '@/components/common/Navbar';

export default function EmployeeDashboard() {
  return (<>
    <Navbar />
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold">
        Employee Dashboard
      </Typography>

      <Typography color="text.secondary">
        View attendance, leaves and profile
      </Typography>
    </Container>
    </>
  );
}
