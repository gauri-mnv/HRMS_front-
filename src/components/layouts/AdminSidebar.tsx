'use client';

import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Employees', path: '/admin/employees' },
  { label: 'Departments', path: '/admin/departments' },
  { label: 'Attendance', path: '/admin/attendance' },
  { label: 'Leaves', path: '/admin/leave-requests' },
  { label: 'Payroll', path: '/admin/payroll' },
  { label: 'Expenses', path: '/admin/expenses' },
  { label: 'Performance', path: '/admin/performance' },
  { label: 'Training', path: '/admin/training' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Audit Logs', path: '/admin/audit-logs' },
  { label: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Drawer variant="permanent" sx={{ width: 240 }}>
        {/* <h2>SIDEBAR LOADED</h2> */}
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={pathname === item.path}
            onClick={() => router.push(item.path)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
