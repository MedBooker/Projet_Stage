// app/dashboard/medecin/planning/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function PlanningPage() {
  const [creneaux, setCreneaux] = useState([
    { id: 1, date: '2025-06-10', debut: '09:00', fin: '10:00', patient: 'Jean Louis' },
    { id: 2, date: '2025-06-10', debut: '11:00', fin: '12:00', patient: 'Disponible' },
  ]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAdd = () => {
    if (!startDate || !endDate) return;
    const newSlot = {
      id: creneaux.length + 1,
      date: startDate.split('T')[0],
      debut: startDate.split('T')[1].slice(0, 5),
      fin: endDate.split('T')[1].slice(0, 5),
      patient: 'Disponible',
    };
    setCreneaux([...creneaux, newSlot]);
    alert("Créneau ajouté !");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Mon Planning</CardTitle>
        </CardHeader>
        <form onSubmit={(e) => handleAdd()}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Date et heure de début</label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Date et heure de fin</label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Ajouter
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Mes Créneaux</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {creneaux.map((slot) => (
              <li key={slot.id} className="flex justify-between p-3 bg-emerald-50 dark:bg-gray-800/30 rounded">
                <div>
                  <strong>{slot.debut} - {slot.fin}</strong>
                  <p className="text-sm">{slot.patient}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:underline">Modifier</button>
                  <button className="text-red-500 hover:underline">Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}