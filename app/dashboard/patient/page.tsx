'use client';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Calendar, Clock, FileText, User, MessageSquare, Stethoscope, Pill, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PatientDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  
  const recentAppointments = [
    {
      id: 1,
      doctor: 'Dr. Ibrahima DIALLO',
      specialty: 'Cardiologie',
      date: '20 mai 2025 - 14h00',
      status: 'confirmé',
      location: 'Clinique du Cœur, Paris',
      avatar: '/avatars/doctor1.jpg'
    },
    {
      id: 2,
      doctor: 'Dr. Moussa NDIAYE',
      specialty: 'Dermatologie',
      date: '15 avril 2025 - 10h30',
      status: 'terminé',
      notes: 'Prescription renouvelée',
      avatar: '/avatars/doctor2.jpg'
    },
  ];

  const medicalRecords = [
    {
      type: 'Ordonnance',
      date: '10 avril 2025',
      doctor: 'Dr. Moussa NDIAYE',
      description: 'Prescription pour traitement dermatologique'
    },
    {
      type: 'Analyse sanguine',
      date: '5 mars 2025',
      doctor: 'Dr. Ibrahima DIALLO',
      description: 'Bilan annuel - Résultats normaux'
    }
  ];

  useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
  }, []);

  useEffect(() => {
    const getInfos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/Patients/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
          }
        });
        const data = await response.json();
        setNom(data.nom);
        setPrenom(data.prenom);
      } catch (error) {
            console.error("Erreur lors du chargement des informations :", error);
        }
    };
      if (token) {
        getInfos();
      }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50 dark:from-emerald-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            {prenom && nom ? (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenue, {`${prenom} ${nom}`}</h1>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenue, Chargement...</h1>
            )}
            <p className="text-gray-600 dark:text-gray-300 mt-2">Voici un résumé de votre activité médicale</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/dashboard/patient/profile" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center">
              <User className="w-4 h-4 mr-2" />
              Mon profil
            </Link>
            <Link href="/dashboard/patient/appointments/new" className="px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Nouveau RDV
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            icon={<Calendar className="w-6 h-6" />}
            title="Prochain RDV"
            value="20 mai 2025"
            description="Cardiologie"
            color="emerald"
            href="/dashboard/patient/appointments"
          />
          
          <StatCard 
            icon={<Activity className="w-6 h-6" />}
            title="Dossiers médicaux"
            value="5 documents"
            description="Dernier ajout: 10 avr."
            color="blue"
            href="/dashboard/patient/medical-records"
          />
          
          <StatCard 
            icon={<Pill className="w-6 h-6" />}
            title="Traitements"
            value="2 actifs"
            description="Dont 1 à renouveler"
            color="purple"
            href="/dashboard/patient/treatments"
          />
          
          <StatCard 
            icon={<MessageSquare className="w-6 h-6" />}
            title="Messages"
            value="3 non lus"
            description="Dernier: Aujourd'hui"
            color="amber"
            href="/dashboard/patient/messages"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SectionCard 
              title="Mes Rendez-vous"
              actionText="Voir tout"
              actionLink="/dashboard/patient/appointments"
            >
              <div className="space-y-4">
                {recentAppointments.map((appt) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            </SectionCard>

            <SectionCard 
              title="Dossiers Médicaux Récents"
              actionText="Tous les documents"
              actionLink="/dashboard/patient/medical-records"
            >
              <div className="space-y-3">
                {medicalRecords.map((record, index) => (
                  <div key={index} className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{record.type}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-500">{record.date}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Par {record.doctor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-8">
            <SectionCard title="Actions Rapides">
              <div className="space-y-3">
                <QuickAction 
                  icon={<Stethoscope className="w-5 h-5" />}
                  title="Trouver un spécialiste"
                  description="Recherchez par spécialité"
                  href="/doctors"
                  color="indigo"
                />
                <QuickAction 
                  icon={<Pill className="w-5 h-5" />}
                  title="Mes traitements"
                  description="Gérer vos prescriptions"
                  href="/dashboard/patient/treatments"
                  color="purple"
                />
                <QuickAction 
                  icon={<FileText className="w-5 h-5" />}
                  title="Demander un document"
                  description="Ordonnance ou certificat"
                  href="/dashboard/patient/requests"
                  color="blue"
                />
                <QuickAction 
                  icon={<MessageSquare className="w-5 h-5" />}
                  title="Contacter mon médecin"
                  description="Messagerie sécurisée"
                  href="/dashboard/patient/messages/new"
                  color="emerald"
                />
              </div>
            </SectionCard>

            <SectionCard title="Rappels">
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start">
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-full mr-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Renouvellement traitement</h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400">À faire avant le 30 mai</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full mr-3">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Bilan annuel</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Recommandé dans 2 mois</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}


type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: string;
  href: string;
};

const StatCard = ({ icon, title, value, description, color, href }: StatCardProps) => {
  const colors = {
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400'
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400'
    },
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-600 dark:text-indigo-400'
    }
  };

  return (
    <Link href={href}>
      <Card className="bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className={`p-3 rounded-full ${colors[color as keyof typeof colors].bg} ${colors[color as keyof typeof colors].text}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{value}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  actionText?: string;
  actionLink?: string;
};

const SectionCard = ({ title, children, actionText, actionLink }: SectionCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h2>
        {actionText && actionLink && (
          <Link href={actionLink} className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
            {actionText}
          </Link>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

type AppointmentCardProps = {
  appointment: {
    id: number;
    doctor: string;
    specialty: string;
    date: string;
    status: string;
    location?: string;
    notes?: string;
    avatar?: string;
  };
};

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const statusColors = {
    confirmé: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    terminé: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    annulé: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'à venir': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex space-x-4">
          {appointment.avatar ? (
            <img src={appointment.avatar} alt={appointment.doctor} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{appointment.doctor}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.specialty}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              <Clock className="inline w-3 h-3 mr-1" />
              {appointment.date}
            </p>
            {appointment.location && (
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{appointment.location}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status as keyof typeof statusColors]}`}>
            {appointment.status}
          </span>
          {appointment.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">{appointment.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
};

type QuickActionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
};

const QuickAction = ({ icon, title, description, href, color }: QuickActionProps) => {
  const colors = {
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400'
    },
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-600 dark:text-indigo-400'
    }
  };

  return (
    <Link href={href} className="group">
      <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center">
        <div className={`p-2 rounded-full ${colors[color as keyof typeof colors].bg} ${colors[color as keyof typeof colors].text} mr-3 group-hover:opacity-80 transition-opacity`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
};