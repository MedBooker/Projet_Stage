'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [patientsEnAttente] = useState(12);
  const [medecinsActifs] = useState(23);
  const [secretaires] = useState(8);
  const [sessionsActives] = useState(35);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Espace Administrateur 👋</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gestion des comptes et sessions</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Médecins actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{medecinsActifs}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gérer les utilisateurs et sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/admin/patients" passHref legacyBehavior>
              <Button variant="outline" className="w-full justify-start">
                ➕ Voir un patient
              </Button>
            </Link>
            <Link href="/dashboard/admin/users/new" passHref legacyBehavior>
              <Button variant="outline" className="w-full justify-start">
                ➕ Ajouter un médecin
              </Button>
            </Link>

          </CardContent>
        </Card>
      </section>
    </div>
  );
}