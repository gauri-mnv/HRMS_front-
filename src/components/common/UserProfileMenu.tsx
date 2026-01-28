'use client';

import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useState, MouseEvent ,useEffect} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL ||'http://localhost:8006';
// const accessToken =localStorage.getItem('accessToken');


export default function UserProfileMenu() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<{ email?: string; role?:any    } | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (token) setAccessToken(token);
  }, []);
  // // Read user from localStorage
  // const user =
  //   typeof window !== 'undefined'
  //     ? JSON.parse(localStorage.getItem('user') || '{}')
  //     : null;

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
console.log("token",accessToken,user);


  const handleLogout = async() => {
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('user');
    // router.push('/auth/signin');
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      localStorage.clear();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    finally {
      localStorage.clear();
      router.push('/auth/signin');
    }
  };

  if (!user?.email) return null;

  return (
    < >
      <IconButton onClick={handleOpen}>
        <Avatar>
          {user.email.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box px={2} py={1}>
          <Typography fontWeight="bold">
            {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role.name}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
