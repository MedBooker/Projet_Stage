'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AppointmentsPage() {
  type Appointment = { id: number; patient: string; creneau: string; date: string; idCreneau: string; status: string; };
  const [token, setToken] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
  })

  useEffect(() => {
    const getAppointments = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/Medecins/get-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      console.log ('test',data);
      const fakeAppointments = data.map((appt: any) => ({
        id: appt.id, 
        patient: appt.prenomNom,
        creneau: appt.creneau,
        date: appt.date,
        idCreneau: appt.idCreneau,
        status: appt.status || 'dispo'  
      }));
      fakeAppointments.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setAppointments(fakeAppointments);
      };
      if (token)
        getAppointments();
  }, [token]);

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
                        {new Date(rdv.date).toLocaleDateString()} · {rdv.creneau}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded">
                      À venir
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