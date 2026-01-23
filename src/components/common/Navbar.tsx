'use client';

import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import UserProfileMenu from './UserProfileMenu';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          HRMS
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <UserProfileMenu />
      </Toolbar>
    </AppBar>
  );
}
