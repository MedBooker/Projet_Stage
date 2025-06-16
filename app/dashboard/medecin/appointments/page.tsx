'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AppointmentsPage() {
  type Appointment = { id: number; patient: string; time: string; date: string };
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fakeAppointments = [
      { id: 1, patient: 'Jean Louis', time: '09:00 - 10:00', date: '2025-06-10' }
    ];
    setAppointments(fakeAppointments);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Mes Rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <ul className="space-y-4">
              {appointments.map((rdv) => (
                <li key={rdv.id} className="p-4 border-l-4 border-emerald-500 bg-gray-50 dark:bg-gray-800/30 rounded-r-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{rdv.patient}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(rdv.date).toLocaleDateString()} · {rdv.time}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded">
                      Confirmé
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun rendez-vous programmé.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}