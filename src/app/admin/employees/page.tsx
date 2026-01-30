'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
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
  Chip
} from '@mui/material';

// --- Types ---
type Employee = {
  emp_id: string;
  emp_code: string;
  emp_first_name: string;
  emp_last_name: string;
  emp_email: string;
  emp_phone: string;
  emp_status: string;
  emp_date_of_joining?: string;
  emp_dob?: string | null;
  emp_gender?: string | null;
  user?: { id: string; email: string };
  // New fields for View Details
  department?: string;
  salary?: number;
  leaves_count?: number;
};

// Initial Form State
const initialFormState = {
  emp_code: '',
  emp_first_name: '',
  emp_last_name: '',
  emp_email: '',
  emp_phone: '',
  emp_status: 'active',
  emp_date_of_joining: '', // YYYY-MM-DD
  emp_dob: '',             // YYYY-MM-DD
  emp_gender: '',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8006';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // --- States for Dialogs ---
  const [openFormDialog, setOpenFormDialog] = useState(false); // Handles Add & Edit
  const [openViewDialog, setOpenViewDialog] = useState(false); // Handles View details

  // --- States for Data Handling ---
  const [employeeForm, setEmployeeForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState<string | null>(null);
  const [viewData, setViewData] = useState<Employee | null>(null);

  // --- Helper: Get Token ---
  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  // --- Fetch Employees ---
  const fetchEmployees = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/emps`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const list = res.data?.data ?? res.data;
      setEmployees(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to load employees', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- Helper to format date for display ---
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };


  // ================= ACTIONS (View, Delete, Open Dialogs) =================

  // --- 1. VIEW ACTION ---
  const handleView = async (id: string) => {
    try {
      // Fetch fresh details from DB (including salary, dept, leaves)
      const res = await axios.get(`${API_URL}/emps/emps/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setViewData(res.data.data); // Store fetched data
      console.log("selected employee data " ,res.data.data);
      setOpenViewDialog(true); // Open popup
    } catch (error) {
      console.error('Failed to fetch details', error);
      alert('Could not fetch employee details.');
    }
  };

  // --- 2. DELETE ACTION ---
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await axios.delete(`${API_URL}/emps/emps/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchEmployees(); // Refresh list
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Failed to delete employee.');
    }
  };

  // --- 3. OPEN ADD DIALOG ---
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEmployeeForm(initialFormState);
    setOpenFormDialog(true);
  };

  // --- 4. OPEN EDIT DIALOG ---
  const handleOpenEdit = (emp: Employee) => {
    setIsEditing(true);
    setCurrentEmpId(emp.emp_id);
    
    // Pre-fill form with existing data
    setEmployeeForm({
      emp_code: emp.emp_code,
      emp_first_name: emp.emp_first_name,
      emp_last_name: emp.emp_last_name,
      emp_email: emp.emp_email,
      emp_phone: emp.emp_phone,
      emp_status: emp.emp_status,
      // Extract YYYY-MM-DD from ISO string for the date inputs
      emp_date_of_joining: emp.emp_date_of_joining ? emp.emp_date_of_joining.split('T')[0] : '',
      emp_dob: emp.emp_dob ? emp.emp_dob.split('T')[0] : '',
      emp_gender: emp.emp_gender || '',
    });
    setOpenFormDialog(true);
  };

  // ================= FORM SUBMISSION (Add & Update) =================

  const handleFormSubmit = async () => {
    // --- 1. Common Field Validations ---
    if (employeeForm.emp_first_name.trim().length < 2) {
      alert('First Name must be at least 2 characters long.');
      return;
    }
    if (employeeForm.emp_last_name.trim().length < 2) {
      alert('Last Name must be at least 2 characters long.');
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(employeeForm.emp_phone)) {
      alert('Phone number must be exactly 10 digits (numbers only).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employeeForm.emp_email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // --- 2. Duplicate Checks (Only when Adding new user) ---
    if (!isEditing) {
      const emailExists = employees.some(
        (emp) => emp.emp_email.toLowerCase() === employeeForm.emp_email.trim().toLowerCase()
      );
      if (emailExists) {
        alert('An employee with this Email address already exists!');
        return; 
      }

      const codeExists = employees.some(
        (emp) => emp.emp_code.trim().toLowerCase() === employeeForm.emp_code.trim().toLowerCase()
      );
      if (codeExists) {
        alert(`An employee with code "${employeeForm.emp_code}" already exists!`);
        return; 
      }
    }

    // --- 3. API Call (Post or Patch) ---
    try {
      const token = getToken();
      
      const payload = {
        ...employeeForm,
        emp_date_of_joining: employeeForm.emp_date_of_joining || new Date().toISOString(),
        emp_dob: employeeForm.emp_dob || null,
        emp_gender: employeeForm.emp_gender || null,
      };

      if (isEditing && currentEmpId) {
        // UPDATE Existing
        await axios.patch(`${API_URL}/emps/update_emps/${currentEmpId}`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      } else {
        // CREATE New
        await axios.post(`${API_URL}/emps/add_emps`, payload, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      }

      setOpenFormDialog(false);
      setEmployeeForm(initialFormState); // Reset form
      fetchEmployees(); // Refresh list
    } catch (error) {
      console.error('Operation failed', error);
      alert('Operation failed. Check console for details.');
    }
  };

  return (
    <Container sx={{ mt: 5, maxWidth: 'lg' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          Employees
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Manage employees added to the organization.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* --- Header Actions --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Employee List</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpenAdd}>
              Add Employee
            </Button>
            <Button variant="outlined" onClick={fetchEmployees}>
              Refresh
            </Button>
          </Box>
        </Box>

        {/* --- Employee Table --- */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>EMP Code</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Joining Date</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.emp_id} hover>
                  <TableCell>{emp.emp_code}</TableCell>
                  <TableCell>
                    {emp.emp_first_name} {emp.emp_last_name}
                  </TableCell>
                  <TableCell>{emp.emp_email}</TableCell>
                  <TableCell>{emp.emp_phone}</TableCell>
                  <TableCell>{formatDate(emp.emp_date_of_joining)}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {emp.emp_gender || '-'}
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={emp.emp_status.toUpperCase()} 
                      size="small"
                      color={emp.emp_status === 'active' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="text" 
                      onClick={() => handleView(emp.emp_id)}
                    >
                      View
                    </Button>
                    <Button 
                      size="small" 
                      variant="text"
                      onClick={() => handleOpenEdit(emp)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      variant="text"
                      onClick={() => handleDelete(emp.emp_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* --- ADD / EDIT Dialog --- */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            
            {/* Row 1: Code, First Name, Last Name */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Employee Code"
                value={employeeForm.emp_code}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_code: e.target.value })}
                fullWidth
                required
                disabled={isEditing} // Often code cannot be changed after creation
              />
              <TextField
                label="First Name"
                value={employeeForm.emp_first_name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_first_name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={employeeForm.emp_last_name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_last_name: e.target.value })}
                fullWidth
                required
              />
            </Box>

            {/* Row 2: Email & Phone */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={employeeForm.emp_email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_email: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={employeeForm.emp_phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_phone: e.target.value })}
                fullWidth
              />
            </Box>

            {/* Row 3: Dates & Gender */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Date of Joining"
                type="date"
                value={employeeForm.emp_date_of_joining}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_date_of_joining: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={employeeForm.emp_dob}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_dob: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Gender"
                select
                value={employeeForm.emp_gender}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_gender: e.target.value })}
                fullWidth
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Box>

            {/* Row 4: Status */}
            <Box>
              <TextField
                label="Status"
                select
                value={employeeForm.emp_status}
                onChange={(e) => setEmployeeForm({ ...employeeForm, emp_status: e.target.value })}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="resigned">Resigned</MenuItem>
              </TextField>
            </Box>

          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>
            {isEditing ? 'Update Employee' : 'Save Employee'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- VIEW DETAILS Dialog --- */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
          Employee Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {viewData ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Full Name:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {viewData.emp_first_name} {viewData.emp_last_name}
                </Typography>
              </Box>
              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">EMP Code:</Typography>
                <Typography variant="body1">{viewData.emp_code}</Typography>
              </Box>
              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Department:</Typography>
                <Typography variant="body1">{viewData.department || '-'}</Typography>
              </Box>
              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Salary:</Typography>
                <Typography variant="body1">
                  {viewData.salary ? `$${viewData.salary}` : '-'}
                </Typography>
              </Box>
              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Leaves Count:</Typography>
                <Typography variant="body1">{viewData.leaves_count ?? '-'}</Typography>
              </Box>
              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
                <Typography variant="body1">{viewData.emp_email}</Typography>
              </Box>
              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Phone:</Typography>
                <Typography variant="body1">{viewData.emp_phone}</Typography>
              </Box>
              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">Status:</Typography>
                <Chip 
                  label={viewData.emp_status} 
                  size="small" 
                  color={viewData.emp_status === 'active' ? 'success' : 'default'} 
                />
              </Box>

            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}