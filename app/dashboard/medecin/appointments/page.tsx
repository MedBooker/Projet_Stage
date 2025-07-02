'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AppointmentsPage() {
  type Appointment = { 
    id: string; 
    patient: string; 
    creneau: string; 
    date: string; 
    idCreneau: string; 
    status: string; 
  };
  
  const [token, setToken] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
  }, []);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/Medecins/get-appointments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        console.log('Données des rendez-vous:', data);

        const formattedAppointments = data.map((appt: any) => ({
          id: appt._id || appt.id,
          patient: appt.prenomNom,
          creneau: appt.creneau,
          date: appt.date,
          idCreneau: appt.idCreneau,
          status: appt.statut || 'confirmé'
        }));

        (formattedAppointments as Appointment[]).sort((a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    
    if (token) getAppointments();
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
                        {rdv.date ? new Date(rdv.date).toLocaleDateString('fr-FR') : 'Date non spécifiée'} · {rdv.creneau}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      rdv.status === 'annulé' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                    }`}>
                      {rdv.status === 'annulé' ? 'Annulé' : 'À venir'}
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