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
import { toast } from "sonner";

export default function PlanningPage() {
  const [creneaux, setCreneaux] = useState([
    { id: 1, date: '2025-06-10', debut: '09:00', fin: '10:00', patient: 'Jean Louis' },
    { id: 2, date: '2025-06-10', debut: '11:00', fin: '12:00', patient: 'Disponible' }
  ]);

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  interface Creneau {
    id: number;
    date: string;
    debut: string;
    fin: string;
    patient: string;
  }

  interface NewSlot {
    _id: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    idMedecin: string;
    created_at: string;
    updated_at: string;
  }

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime) {
      toast('Veuillez remplir tous les champs');
      return;
    }

    if (startTime >= endTime) {
      toast("L'heure de fin doit être après l'heure de début");
      return;
    }

    const newSlot: NewSlot = {
      _id: `slot-${creneaux.length + 1}`,
      date: date,
      heureDebut: startTime,
      heureFin: endTime,
      idMedecin: '', 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    fetch('/api/doctor/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSlot)
    })
      .then((res: Response) => res.json())
      .then((data: unknown) => {
        alert("Créneau ajouté avec succès !");
        setCreneaux([...creneaux, {
          id: creneaux.length + 1,
          date: date,
          debut: startTime,
          fin: endTime,
          patient: 'Disponible' 
        }]);
        setDate('');
        setStartTime('');
        setEndTime('');
      })
      .catch((err: unknown) => {
        console.error("Erreur lors de l'ajout:", err);
        alert("Erreur lors de l'ajout du créneau");
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ajouter un créneau</CardTitle>
        </CardHeader>
        <form onSubmit={handleAdd}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Heure de début</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Heure de fin</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Ajouter Créneau
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes Créneaux</CardTitle>
        </CardHeader>
        <CardContent>
          {creneaux.length === 0 ? (
            <p className="text-gray-500">Aucun créneau programmé</p>
          ) : (
            <ul className="space-y-3">
              {creneaux.map((slot) => (
                <li 
                  key={slot.id} 
                  className="p-4 bg-emerald-50 dark:bg-gray-800 rounded-md flex justify-between items-center border border-emerald-100"
                >
                  <div>
                    <p className="font-semibold">
                      {new Date(slot.date).toLocaleDateString('fr-FR')} • {slot.debut} - {slot.fin}
                    </p>
                    <p className={`text-sm ${
                      slot.patient === 'Disponible' 
                        ? 'text-emerald-600' 
                        : 'text-gray-600'
                    }`}>
                      {slot.patient}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm">
                      Supprimer
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}