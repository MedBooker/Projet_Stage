'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UsersPage() {
  const [users] = useState([
    { id: 1, name: 'Dr. Ibrahima DIALLO', role: 'doctor', status: 'actif' },
    { id: 2, name: 'Anne Marie', role: 'secretary', status: 'actif' },
    { id: 3, name: 'Admin Principal', role: 'admin', status: 'actif' }
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Utilisateurs</h2>
      <a href="http://localhost:3000/dashboard/admin/users/new" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors">
        Ajouter un utilisateur
      </a>
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                <th>Nom</th>
                <th>Rôle</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="text-sm">
                  <td className="py-3">{user.name}</td>
                  <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                  <td>
                    <Badge variant="default" className={`capitalize ${user.status === 'actif' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>
                      {user.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:underline">Modifier</button>
                      <button className="text-red-500 hover:underline">Désactiver</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}