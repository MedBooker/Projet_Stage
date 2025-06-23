'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PatientsPage() {
  const [patients] = useState([
    { id: 1, nom: 'Jean Louis', email: 'jean.louis@example.com', status: 'en attente' },
    { id: 2, nom: 'Awa Sow', email: 'awa.sow@example.com', status: 'en attente' }
  ]);

  const handleValidate = (id: number) => {
    alert(`Patient #${id} validé`);
  };

  const handleReject = (id: number) => {
    alert(`Patient #${id} rejeté`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Patients en attente</h2>
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6">
          <ul className="space-y-4">
            {patients.map((patient) => (
              <li key={patient.id} className="p-4 border-l-4 border-emerald-500 bg-gray-50 dark:bg-gray-700/30 rounded-r-md">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{patient.nom}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{patient.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="default" className="capitalize bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                      {patient.status}
                    </Badge>
                    <Button onClick={() => handleValidate(patient.id)} variant="outline" size="sm">
                      ✅ Valider
                    </Button>
                    <Button onClick={() => handleReject(patient.id)} variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                      ❌ Rejeter
                    </Button>
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