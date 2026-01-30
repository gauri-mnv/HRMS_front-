'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8006';

type Department = {
  id: string;
  name: string;
  head?: string;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchDepartments = async () => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const res = await axios.get(`${API_URL}/departments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const list = res.data?.data ?? res.data;
      setDepartments(list || []);
    } catch (error) {
      console.error('Failed to load departments', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Departments
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Head</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.head ?? '-'}</TableCell>
              </TableRow>
            ))}
            {departments.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No departments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
