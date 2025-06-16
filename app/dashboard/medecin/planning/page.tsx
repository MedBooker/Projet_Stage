'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function PlanningPage() {
  const [creneaux, setCreneaux] = useState([
    { id: 1, debut: '09:00', fin: '10:00', patient: 'Jean Louis', statut: 'occupé' },
    { id: 2, debut: '11:00', fin: '12:00', patient: 'Disponible', statut: 'disponible' },
  ]);

  const [debut, setDebut] = useState('');
  const [fin, setFin] = useState('');

  interface Creneau {
    id: number;
    debut: string;
    fin: string;
    patient: string;
    statut: string;
  }

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!debut || !fin) return;
    const newSlot: Creneau = {
      id: creneaux.length + 1,
      debut,
      fin,
      patient: 'Disponible',
      statut: 'disponible'
    };
    setCreneaux([...creneaux, newSlot]);
    alert(`Créneau ajouté : ${debut} → ${fin}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un créneau horaire</CardTitle>
        </CardHeader>
        <form onSubmit={handleAdd}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="debut">Heure de début</Label>
                <Input
                  id="debut"
                  type="time"
                  value={debut}
                  onChange={(e) => setDebut(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fin">Heure de fin</Label>
                <Input
                  id="fin"
                  type="time"
                  value={fin}
                  onChange={(e) => setFin(e.target.value)}
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
          <ul className="space-y-2">
            {creneaux.map((slot) => (
              <li key={slot.id} className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-md">
                <span>{slot.debut} - {slot.fin}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  slot.statut === 'disponible'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                  {slot.statut}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}