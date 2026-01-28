'use client';


import Navbar from '@/components/common/Navbar';
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
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    emp_code: '',
    emp_first_name: '',
    emp_last_name: '',
    emp_email: '',
    emp_phone: '',
    emp_status: 'active',
  });
  const fetchEmployees = async () => {
    try {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

      const res = await axios.get(`${API_URL}/emps`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });

      // assuming Nest global response interceptor wraps data as { data: [...] }
      const list = res.data?.data ?? res.data;
      setEmployees(list || []);
    } catch (error) {
      console.error('Failed to load employees', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const res = await axios.get(`${API_URL}/users`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      });
      console.log('TOKEN1:', localStorage.getItem('accessToken'));
      const list = res.data?.data ?? res.data;
      setUsers(list || []);
    } catch (error) {
      console.error('Failed to load users', error);
    }
  };
  const handleAddEmployee = async () => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;
  
      await axios.post(`${API_URL}/add_emps`, employeeForm, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });
      console.log('TOKEN2:', localStorage.getItem('accessToken'));
      setOpenAddEmployee(false);
      setEmployeeForm({
        emp_code: '',
        emp_first_name: '',
        emp_last_name: '',
        emp_email: '',
        emp_phone: '',
        emp_status: 'active',
      });
  
      fetchEmployees();
    } catch (error) {
      console.error('Failed to add employee', error);
    }
  };
  
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
      await fetchEmployees();
    } catch (error) {
      console.error('Failed to add employee from user', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchUsers();
  }, []);

  const employeeUserIds = new Set(
    (employees || []).map((e) => e.user?.id).filter(Boolean) as string[],
  );

  return (
    <Container sx={{ mt: 5 }}>
      <Navbar />

      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Manage employees, roles and organization
      </Typography>

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

    <Button variant="outlined" onClick={fetchUsers}>
      Refresh Users
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


      {/* ================= EMPLOYEES SECTION ================= */}
<Box sx={{ mb: 4 }}>
  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
    Employees Management
  </Typography>

  <Typography color="text.secondary" sx={{ mb: 2 }}>
    Manage employees added to the organization.
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
    <Typography variant="h6">Employees</Typography>

    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddEmployee(true)} // popup
      >
        Add Employee
      </Button>

      <Button variant="outlined" onClick={fetchEmployees}>
        Refresh
      </Button>
    </Box>
  </Box>

  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Emp Code</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {employees.map((emp) => (
          <TableRow key={emp.emp_id}>
            <TableCell>{emp.emp_code}</TableCell>
            <TableCell>
              {emp.emp_first_name} {emp.emp_last_name}
            </TableCell>
            <TableCell>{emp.emp_email}</TableCell>
            <TableCell>{emp.emp_phone}</TableCell>
            <TableCell>{emp.emp_status}</TableCell>
            <TableCell align="right">
              <Button size="small" variant="text">View</Button>
              <Button size="small" variant="text">Edit</Button>
              <Button size="small" color="error" variant="text">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}

        {employees.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center">
              No employees found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
<Dialog
  open={openAddEmployee}
  onClose={() => setOpenAddEmployee(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Add New Employee</DialogTitle>

  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
    <TextField
      label="Employee Code"
      value={employeeForm.emp_code}
      onChange={(e) =>
        setEmployeeForm({ ...employeeForm, emp_code: e.target.value })
      }
      fullWidth
    />

    <TextField
      label="First Name"
      value={employeeForm.emp_first_name}
      onChange={(e) =>
        setEmployeeForm({ ...employeeForm, emp_first_name: e.target.value })
      }
      fullWidth
    />

    <TextField
      label="Last Name"
      value={employeeForm.emp_last_name}
      onChange={(e) =>
        setEmployeeForm({ ...employeeForm, emp_last_name: e.target.value })
      }
      fullWidth
    />

    <TextField
      label="Email"
      type="email"
      value={employeeForm.emp_email}
      onChange={(e) =>
        setEmployeeForm({ ...employeeForm, emp_email: e.target.value })
      }
      fullWidth
    />

    <TextField
      label="Phone"
      value={employeeForm.emp_phone}
      onChange={(e) =>
        setEmployeeForm({ ...employeeForm, emp_phone: e.target.value })
      }
      fullWidth
    />

    <TextField
      label="Status"
      select
      value={employeeForm.emp_status}
      onChange={(e) =>
        setEmployeeForm({ ...employeeForm, emp_status: e.target.value })
      }
    >
      <MenuItem value="active">ACTIVE</MenuItem>
      <MenuItem value="inactive">INACTIVE</MenuItem>
      <MenuItem value="resigned">RESIGNED</MenuItem>
    </TextField>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenAddEmployee(false)}>Cancel</Button>
    <Button variant="contained" onClick={handleAddEmployee}>
      Add Employee
    </Button>
  </DialogActions>
</Dialog>
    </Container>
  );
}
  