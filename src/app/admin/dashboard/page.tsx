'use client';


import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8006';

type Role = {
  id: string;
  name: string;
};

type User = {
  id: string;
  email: string;
  role: Role | null;
};


type Employee = {
  emp_id: number;
  emp_code: string;
  emp_first_name: string;
  emp_last_name: string;
  emp_email: string;
  emp_phone: string;
  emp_status: string;
  user?: { id: string; email: string };
};

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  

  // const fetchEmployees = async () => {
  //   try {
  //     const token = typeof window !== 'undefined'
  //       ? localStorage.getItem('accessToken')
  //       : null;
  //     console.log('accessToken emp', token)
  //     const res = await axios.get(`${API_URL}/emps`, {
  //       headers: token
  //         ? {
  //             Authorization: `Bearer ${token}`,
  //           }
  //         : undefined,
  //     });

  //     // assuming Nest global response interceptor wraps data as { data: [...] }
  //     const list = res.data?.data ?? res.data;
  //     console.log('emp', list)
  //     setEmployees(list || []);
  //   } catch (error) {
  //     console.error('Failed to load employees', error);
  //   }
  // };

  // const fetchUsers = async () => {
  //   try {
  //     const token =
  //       typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  //       console.log('accessToken users', token);
  //     const res = await axios.get(`${API_URL}/users`, {
  //       headers: token
  //         ? {
  //             Authorization: `Bearer ${token}`,
  //           }
  //         : undefined,
  //     });
  //     console.log("res,",res.data)
  //     // console.log('TOKEN1:', localStorage.getItem('accessToken'));
  //     const list = res.data?.data ?? res.data;
  //     setUsers(list || []);
  //   } catch (error) {
  //     console.error('Failed to load users', error);
  //   }
  // };


  const fetchDashboardData = async () => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : undefined;
  
    try {
      const [usersRes, employeesRes] = await Promise.all([
        axios.get(`${API_URL}/users`, { headers }),
         axios.get(`${API_URL}/emps`, { headers }),
      ]);
 console.log("users",usersRes.data)
      setUsers(usersRes.data?.data ?? usersRes.data);
       setEmployees(employeesRes.data?.data ?? employeesRes.data);
    } catch (err) {
      console.error('Dashboard fetch failed', err);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const addEmployeeFromUser = async (userId: string) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      await axios.post(
        `${API_URL}/emps/from-user/${userId}`,
        {},
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        },
      );
      console.log('TOKEN3:', localStorage.getItem('accessToken'));
      // await fetchEmployees();
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to add employee from user', error);
    }
  };

  // useEffect(() => {
  //   fetchEmployees();
  //   fetchUsers();
  // }, []);


  const employeeUserIds = new Set(
    (employees || []).map((e) => e.user?.id).filter(Boolean) as string[],
  );

  return (
    <Container sx={{ mt: 5 }}>

      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Manage employees, roles and organization
      </Typography>
      <Box
  sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 2,
    mb: 5,
  }}
>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">Total Users</Typography>
    <Typography variant="h4">{users.length}</Typography>
  </Paper>

  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">Total Employees</Typography>
    <Typography variant="h4">{employees.length}</Typography>
  </Paper>

  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">Active Employees</Typography>
    <Typography variant="h4">
      {employees.filter(e => e.emp_status === 'active').length}
    </Typography>
  </Paper>
</Box>


      {/* ================= USERS SECTION ================= */}
<Box sx={{ mb: 6 }}>
  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
    Users Management
  </Typography>

  <Typography color="text.secondary" sx={{ mb: 2 }}>
    All registered users. Only EMPLOYEE role users can be converted to employees.
  </Typography>

  <Divider sx={{ mb: 2 }} />

  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
    }}
  >
    <Typography variant="h6">Users</Typography>

    {/* <Button variant="outlined" onClick={fetchUsers}>
      Refresh Users
    </Button> */}

        <Button variant="outlined" onClick={fetchDashboardData}>
          Refresh Dashboard
        </Button>
  </Box>

  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {users.map((u) => {
          const isEmployeeRole = u.role?.name === 'EMPLOYEE';
          const alreadyEmployee = employeeUserIds.has(u.id);

          return (
            <TableRow key={u.id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role?.name ?? '-'}</TableCell>
              <TableCell align="right">
                {isEmployeeRole ? (
                  <Button
                    size="small"
                    variant="contained"
                    disabled={alreadyEmployee}
                    onClick={() => addEmployeeFromUser(u.id)}
                  >
                    {alreadyEmployee ? 'Already Added' : 'Add Employee'}
                  </Button>
                ) : (
                  <Button size="small" variant="text" disabled>
                    Not an Employee
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}

        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} align="center">
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>





    </Container>
  );
}
  