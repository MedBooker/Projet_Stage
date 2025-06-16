'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState([
    { id: 1, nom: 'Jean Louis', derniereVisite: '12/06/2025' },
    { id: 2, nom: 'Awa Sow', derniereVisite: '10/06/2025' },
  ]);

  const filteredPatients = patients.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Mes Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <ul className="space-y-3">
            {filteredPatients.map((patient) => (
              <li key={patient.id} className="p-4 border-l-4 border-emerald-500 bg-gray-50 dark:bg-gray-800/30 rounded-r-md">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{patient.nom}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dernière visite : {patient.derniereVisite}</p>
                  </div>
                  <button className="text-sm text-emerald-600 hover:underline">Détail</button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}