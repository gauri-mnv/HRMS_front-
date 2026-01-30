'use client';

import { Box } from '@mui/material';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import Navbar from '@/components/common/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
