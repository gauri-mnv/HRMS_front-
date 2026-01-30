'use client';

import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '@/app/services/users.api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div>
      <h1>Users</h1>
      {users.map((u) => (
        <div key={u.id}>
          {u.email} — {u.role?.name}
          <button onClick={() => handleDelete(u.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
