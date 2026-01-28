'use client';

import Navbar from '@/components/common/Navbar';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8006';

type Employee = {
  emp_id: string;
  emp_code: string;
  emp_first_name: string;
  emp_last_name: string;
  emp_email: string;
  emp_phone: string;
  emp_date_of_joining: string;
  emp_status: string;
  emp_dob: string | null;
  emp_gender: string | null;
  role?: { id: number; name: string };
};

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;

      const res = await axios.get(`${API_URL}/employee/me`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      const data = res.data?.data ?? res.data;
      setEmployee(data);
    } catch (error) {
      console.error('Failed to load employee profile', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange =
    (field: keyof Employee) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!employee) return;
      setEmployee({ ...employee, [field]: e.target.value });
    };

  const handleUpdate = async () => {
    if (!employee) return;
    try {
      setSaving(true);
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;

      const payload = {
        emp_first_name: employee.emp_first_name,
        emp_last_name: employee.emp_last_name,
        emp_phone: employee.emp_phone,
        emp_dob: employee.emp_dob,
        emp_gender: employee.emp_gender,
      };

      await axios.patch(`${API_URL}/employee/me`, payload, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      await loadProfile();
      setOpenEdit(false);
    } catch (error) {
      console.error('Failed to update employee profile', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" fontWeight="bold">
          Employee Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          View your profile details. Editing is available via popup.
        </Typography>

        {loading && (
          <Typography>Loading your profile...</Typography>
        )}

        {!loading && employee && (
          <>
            {/* PROFILE TABLE */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Employee ID</strong></TableCell>
                    <TableCell>{employee.emp_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Employee Code</strong></TableCell>
                    <TableCell>{employee.emp_code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell>{employee.emp_email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Role</strong></TableCell>
                    <TableCell>{employee.role?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Date of Joining</strong></TableCell>
                    <TableCell>{employee.emp_date_of_joining}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell>{employee.emp_status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>First Name</strong></TableCell>
                    <TableCell>{employee.emp_first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Last Name</strong></TableCell>
                    <TableCell>{employee.emp_last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell>{employee.emp_phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>DOB</strong></TableCell>
                    <TableCell>{employee.emp_dob || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Gender</strong></TableCell>
                    <TableCell>{employee.emp_gender || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Button variant="contained" onClick={() => setOpenEdit(true)}>
              Edit Profile
            </Button>

            {/* EDIT POPUP */}
                        <Dialog
                          open={openEdit}
                          onClose={() => setOpenEdit(false)}
                          fullWidth
                          maxWidth="sm"
                        >
                          <DialogTitle>Edit Profile</DialogTitle>

                          <DialogContent dividers>
                            <Box display="flex" flexDirection="column" gap={2}>
                              <TextField
                                label="First Name"
                                value={employee.emp_first_name}
                                onChange={handleChange('emp_first_name')}
                                fullWidth
                              />

                              <TextField
                                label="Last Name"
                                value={employee.emp_last_name}
                                onChange={handleChange('emp_last_name')}
                                fullWidth
                              />

                              <TextField
                                label="Phone"
                                value={employee.emp_phone}
                                onChange={handleChange('emp_phone')}
                                fullWidth
                              />

                              <TextField
                                label="Date of Birth"
                                type="date"
                                value={employee.emp_dob ?? ''}
                                onChange={handleChange('emp_dob')}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                              />

                              <TextField
                                label="Gender"
                                value={employee.emp_gender ?? ''}
                                onChange={handleChange('emp_gender')}
                                fullWidth
                              />
                            </Box>
                          </DialogContent>

                          <DialogActions>
                            <Button onClick={() => setOpenEdit(false)} color="inherit">
                              Close
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleUpdate}
                              disabled={saving}
                            >
                              {saving ? 'Updating...' : 'Update'}
                            </Button>
                          </DialogActions>
                        </Dialog>

          </>
        )}
      </Container>
    </>
  );
}
