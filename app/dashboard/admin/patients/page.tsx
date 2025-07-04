'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


type Patient = {
  _id: string;
  prenom: string;
  nom: string;
  adresseMail: string;
  numeroDeTelephone: string;
  statut?: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

useEffect(() => {
  const fetchPatients = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch('http://127.0.0.1:8000/api/Admin/get-patients', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem('auth_token');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchPatients();
}, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Liste des patients</h2>
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6">
          <ul className="space-y-4">
            {patients.map((patient) => (
              <li key={patient._id} className="p-4 border-l-4 border-emerald-500 bg-gray-50 dark:bg-gray-700/30 rounded-r-md">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{patient.prenom} {patient.nom}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{patient.adresseMail}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{patient.numeroDeTelephone}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="default" className="capitalize bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                      {patient.statut || 'actif'}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}