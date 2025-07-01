'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');

  const doctors = [
    {
      id: 1,
      name: 'Dr. Ibrahima DIALLO',
      specialty: 'Cardiologie',
    },
    {
      id: 2,
      name: 'Dr. Moussa NDIAYE',
      specialty: 'Dermatologie',
    },
    {
      id: 3,
      name: 'Dr. Elisabeth CAMARA',
      specialty: 'Pédiatrie',
    },
    {
      id: 4,
      name: 'Dr. Gervais MENDY',
      specialty: 'Cardiologie',
    },
    {
      id: 5,
      name: 'Dr. Aissatou SOW',
      specialty: 'Neurologie',
    },
    {
      id: 6,
      name: 'Dr. Fatoumata DIOP',
      specialty: 'Pédiatrie',
    }
  ];

  const specialties = ['Tous', ...new Set(doctors.map(doctor => doctor.specialty))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'Tous' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/30 dark:to-emerald-950 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">
              Trouvez votre Médecin
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Consultez notre liste de professionnels de santé qualifiés
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                placeholder="Rechercher par nom ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                aria-label="Filtrer par spécialité"
              >
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {specialties.filter(s => s !== 'Tous').map((specialty, index) => (
              <Button
                key={index}
                variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                onClick={() => setSelectedSpecialty(specialty)}
                className="rounded-full px-4 py-1 text-sm"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </motion.div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <div className="mt-2">
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {doctor.specialty}
                          </Badge>
                        </div>
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="mx-auto max-w-md">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-200">
                Aucun résultat trouvé
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSpecialty('Tous');
                  }}
                  variant="outline"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}