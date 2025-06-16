'use client';

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MedecinDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments] = useState([
    { id: 1, patient: 'Jean Louis', time: '09:00 - 10:00' },
    { id: 2, patient: 'Awa Sow', time: '11:00 - 12:00' }
  ]);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Bonjour, Dr. Diaw 👋</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Bienvenue dans votre espace personnalisé.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Rendez-vous cette semaine" value={15} trend="up" />
        <StatCard title="Taux de présence" value="92%" trend="neutral" />
        <StatCard title="Créneaux libres" value={8} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>Vos créneaux et rendez-vous.</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Gérer mes créneaux
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gérer les créneaux du {date?.toDateString()}</DialogTitle>
                </DialogHeader>
                <CreneauForm />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochains Rendez-vous</CardTitle>
            <CardDescription>Liste des consultations à venir.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {appointments.map((rdv) => (
                <li key={rdv.id} className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                  <span>{rdv.patient}</span>
                  <span className="text-sm text-muted-foreground">{rdv.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-4">
            <Button variant="outline" className="w-full">
              Voir tous les RDV
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes Patients</CardTitle>
            <CardDescription>Liste des patients suivis cette semaine.</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Rechercher un patient..."
              className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded"
            />
            <ul className="space-y-2">
              <li className="flex justify-between text-sm">
                <span>Jean Louis</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Dernier RDV: 12/06</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Awa Sow</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Dernier RDV: 10/06</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Hebdomadaire</CardTitle>
            <CardDescription>Rendez-vous, taux d'absence, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center text-gray-400">
              <p>📊 Graphique ici</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string; value: number | string; trend?: 'up' | 'down' | 'neutral' }) {
  const color =
    trend === 'up'
      ? 'text-green-500'
      : trend === 'down'
      ? 'text-red-500'
      : 'text-gray-500';

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend === 'up' && <TrendingUpIcon className={`w-4 h-4 ${color}`} />}
        {trend === 'down' && <TrendingDownIcon className={`w-4 h-4 ${color}`} />}
        {trend === 'neutral' && <ArrowUpDownIcon className={`w-4 h-4 ${color}`} />}
      </CardHeader>
      <CardContent>
        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{value}</p>
      </CardContent>
    </Card>
  );
}

function CreneauForm() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  interface CreneauFormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (e: CreneauFormEvent) => {
    e.preventDefault();
    alert(`Créneau ajouté : ${startTime} → ${endTime}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Heure de début</label>
        <input
          type="time"
          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded"
          onChange={(e) => setStartTime(e.target.value)}
          required
          placeholder="Heure de début"
          title="Heure de début"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Heure de fin</label>
        <input
          type="time"
          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded"
          onChange={(e) => setEndTime(e.target.value)}
          required
          placeholder="Heure de fin"
          title="Heure de fin"
        />
      </div>
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
        Ajouter Créneau
      </Button>
    </form>
  );
}

function TrendingUpIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}

function TrendingDownIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
  );
}

function ArrowUpDownIcon({ className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 5H3M21 19H3M16 9L16 16M12 9L12 16M8 9L8 16M16 16L12 20L8 16M16 8L12 4L8 8" />
    </svg>
  );
}