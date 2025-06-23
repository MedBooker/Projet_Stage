'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SessionsPage() {
  const [sessions] = useState([
    { id: 1, user: 'Dr. Ibrahima DIALLO', role: 'doctor', lastActive: 'Il y a 2 min' },
    { id: 2, user: 'Anne Marie', role: 'secretary', lastActive: 'Il y a 10 min' },
    { id: 3, user: 'Admin Principal', role: 'admin', lastActive: 'Il y a 3 h' }
  ]);

  const handleLogout = (id: number) => {
    alert(`Session #${id} fermée`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Sessions Actives</h2>
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6">
          <ul className="space-y-3">
            {sessions.map((session) => (
              <li key={session.id} className="p-4 bg-emerald-50 dark:bg-gray-700/30 rounded-md flex justify-between items-center">
                <div>
                  <strong>{session.user}</strong>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Rôle : {session.role} · Dernière activité : {session.lastActive}
                  </p>
                </div>
                <button onClick={() => handleLogout(session.id)} className="text-red-500 hover:underline">
                  Déconnecter
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}