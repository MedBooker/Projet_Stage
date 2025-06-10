'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');

  const doctors = [
    {
      id: 1,
      name: 'Dr. Ibrahima DIALLO',
      specialty: 'Cardiologie',
      experience: '15 ans d’expérience',
      image: '/doctor1.jpg',
      languages: ['Français', 'Anglais'],
      education: 'Université Cheikh Anta DIOP, Hôpital Principal de Dakar',
      awards: ['Prix de la Recherche Cardiologique 2018', 'Meilleur Médecin 2020']
    },
    {
      id: 2,
      name: 'Dr. Moussa NDIAYE',
      specialty: 'Dermatologie',
      experience: '12 ans d’expérience',
      image: '/doctor2.jpg',
      languages: ['Français', 'Espagnol'],
      education: 'Université de Dakar, Hôpital Aristide Le Dantec',
      awards: ['Innovation en Dermatologie 2019']
    },
    {
      id: 3,
      name: 'Dr. Elisabeth CAMARA',
      specialty: 'Pédiatrie',
      experience: '10 ans d’expérience',
      image: '/doctor3.jpg',
      languages: ['Français', 'Anglais', 'Arabe'],
      education: 'Université de Thiès, Hôpital de l’Enfant',
      awards: ['Prix de la Pédiatrie Humaniste 2021']
    },
    {
      id: 4,
      name: 'Dr. Gervais MENDY',
      specialty: 'Cardiologie',
      experience: '18 ans d’expérience',
      image: '/doctor4.jpg',
      languages: ['Français', 'Allemand'],
      education: 'Université de Dakar, Hôpital Général de Grand Yoff',
      awards: ['Prix d\'Excellence en Cardiologie 2022']
    },
    {
      id: 5,
      name: 'Dr. Aissatou SOW',
      specialty: 'Neurologie',
      experience: '14 ans d’expérience',
      image: '/doctor5.jpg',
      languages: ['Français', 'Anglais', 'Italien'],
      education: 'Université Gaston Berger, Hôpital Fann',
      awards: []
    },
    {
      id: 6,
      name: 'Dr. Fatoumata DIOP',
      specialty: 'Pédiatrie',
      experience: '8 ans d’expérience',
      image: '/doctor6.jpg',
      languages: ['Français', 'Portugais'],
      education: 'Université Alioune Diop, Hôpital de Pikine',
      awards: ['Jeune Talent Médical 2020']
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
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">
              Trouvez votre Médecin
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Notre équipe de professionnels qualifiés est à votre service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rechercher un médecin
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Nom ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Spécialité médicale
              </label>
              <select
                id="specialty"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {specialties.filter(s => s !== 'Tous').map((specialty, index) => (
              <Button
                key={index}
                variant={selectedSpecialty === specialty ? 'default' : 'outline'}
                onClick={() => setSelectedSpecialty(specialty)}
                className="rounded-full"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </motion.div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full flex flex-col border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                  <div className="relative h-64">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-white/90 dark:bg-gray-900/90">
                        {doctor.specialty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1">
                    <h3 className="text-xl font-bold">{doctor.name}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400">{doctor.experience}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {doctor.education}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {doctor.languages.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    {doctor.awards.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Distinctions :</h4>
                        <ul className="space-y-1">
                          {doctor.awards.map((award, i) => (
                            <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                              <svg className="w-3 h-3 text-emerald-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {award}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    <Link href={`/doctors/${doctor.id}`} passHref legacyBehavior>
                      <Button asChild variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                        <a>Prendre rendez-vous</a>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
              Aucun médecin ne correspond à votre recherche
            </h3>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('Tous');
            }}>
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}