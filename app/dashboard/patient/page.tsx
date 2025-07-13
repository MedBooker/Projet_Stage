'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Calendar, Clock, FileText, User, MessageSquare, Stethoscope, Pill, Activity, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PatientDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{nom: string; prenom: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const recentAppointments: AppointmentCardProps['appointment'][] = [
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
      id: 1,
      type: 'Ordonnance',
      date: '10 avril 2025',
      doctor: 'Dr. Moussa NDIAYE',
      description: 'Prescription pour traitement dermatologique',
      icon: <Pill className="w-4 h-4" />
    },
    {
      id: 2,
      type: 'Analyse sanguine',
      date: '5 mars 2025',
      doctor: 'Dr. Ibrahima DIALLO',
      description: 'Bilan annuel - Résultats normaux',
      icon: <Activity className="w-4 h-4" />
    }
  ];

  const reminders = [
    {
      id: 1,
      title: 'Renouvellement traitement',
      date: 'À faire avant le 30 mai',
      icon: <Pill className="w-4 h-4" />,
      color: 'amber'
    },
    {
      id: 2,
      title: 'Bilan annuel',
      date: 'Recommandé dans 2 mois',
      icon: <Activity className="w-4 h-4" />,
      color: 'blue'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Trouver un spécialiste',
      description: 'Recherchez par spécialité',
      href: '/doctors',
      icon: <Stethoscope className="w-5 h-5" />,
      color: 'indigo'
    },
    {
      id: 2,
      title: 'Mes traitements',
      description: 'Gérer vos prescriptions',
      href: '/dashboard/patient/treatments',
      icon: <Pill className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 3,
      title: 'Demander un document',
      description: 'Ordonnance ou certificat',
      href: '/dashboard/patient/requests',
      icon: <FileText className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 4,
      title: 'Contacter mon médecin',
      description: 'Messagerie sécurisée',
      href: '/dashboard/patient/messages/new',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'emerald'
    }
  ];

  useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Patients/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Erreur de chargement');
        
        const data = await response.json();
        setUserData({
          nom: data.nom,
          prenom: data.prenom
        });
      } catch (error) {
        console.error("Erreur lors du chargement des informations :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/95 to-emerald-50/95 dark:from-gray-950 dark:to-emerald-950/95 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-80" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Bonjour, <span className="text-emerald-600 dark:text-emerald-400">{userData?.prenom}</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Voici un aperçu de votre activité médicale
                </p>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="default" className="gap-2">
              <Link href="/dashboard/patient/profile">
                <User className="w-4 h-4" />
                Mon profil
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="gap-2">
              <Link href="/dashboard/patient/appointments/new">
                <Calendar className="w-4 h-4" />
                Nouveau RDV
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <StatCard 
            icon={<Calendar className="w-5 h-5" />}
            title="Prochain RDV"
            value="20 mai 2025"
            description="Cardiologie"
            color="emerald"
            href="/dashboard/patient/appointments"
            loading={isLoading}
          />
          
          <StatCard 
            icon={<Activity className="w-5 h-5" />}
            title="Dossiers médicaux"
            value="5 documents"
            description="Dernier ajout: 10 avr."
            color="blue"
            href="/dashboard/patient/medical-records"
            loading={isLoading}
          />
          
          <StatCard 
            icon={<Pill className="w-5 h-5" />}
            title="Traitements"
            value="2 actifs"
            description="Dont 1 à renouveler"
            color="purple"
            href="/dashboard/patient/treatments"
            loading={isLoading}
          />
          
          <StatCard 
            icon={<MessageSquare className="w-5 h-5" />}
            title="Messages"
            value="3 non lus"
            description="Dernier: Aujourd'hui"
            color="amber"
            href="/dashboard/patient/messages"
            loading={isLoading}
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SectionCard 
              title="Mes Rendez-vous"
              actionText="Voir tout"
              actionLink="/dashboard/patient/appointments"
              loading={isLoading}
            >
              <div className="space-y-4">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))
                ) : (
                  <AnimatePresence>
                    {recentAppointments.map((appt) => (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AppointmentCard appointment={appt} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </SectionCard>

            <SectionCard 
              title="Dossiers Médicaux Récents"
              actionText="Tous les documents"
              actionLink="/dashboard/patient/medical-records"
              loading={isLoading}
            >
              <div className="space-y-3">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))
                ) : (
                  <AnimatePresence>
                    {medicalRecords.map((record) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MedicalRecordCard record={record} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-8">
            <SectionCard title="Actions Rapides" loading={isLoading}>
              <div className="space-y-3">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))
                ) : (
                  <AnimatePresence>
                    {quickActions.map((action) => (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: action.id * 0.05 }}
                      >
                        <QuickAction action={action} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Rappels" loading={isLoading}>
              <div className="space-y-3">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))
                ) : (
                  <AnimatePresence>
                    {reminders.map((reminder) => (
                      <motion.div
                        key={reminder.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: reminder.id * 0.1 }}
                      >
                        <ReminderCard reminder={reminder} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
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
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'indigo';
  href: string;
  loading?: boolean;
};

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  actionText?: string;
  actionLink?: string;
  loading?: boolean;
};

type AppointmentCardProps = {
  appointment: {
    id: number;
    doctor: string;
    specialty: string;
    date: string;
    status: 'confirmé' | 'terminé' | 'annulé' | 'à venir';
    location?: string;
    notes?: string;
    avatar?: string;
  };
};

type MedicalRecordCardProps = {
  record: {
    id: number;
    type: string;
    date: string;
    doctor: string;
    description: string;
    icon?: React.ReactNode;
  };
};

type QuickActionProps = {
  action: {
    id: number;
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: string;
  };
};

type ReminderCardProps = {
  reminder: {
    id: number;
    title: string;
    date: string;
    icon: React.ReactNode;
    color: string;
  };
};

const StatCard = ({ icon, title, value, description, color, href, loading }: StatCardProps) => {
  const colorVariants = {
    emerald: {
      bg: 'bg-emerald-100/80 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    blue: {
      bg: 'bg-blue-100/80 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400'
    },
    purple: {
      bg: 'bg-purple-100/80 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400'
    },
    amber: {
      bg: 'bg-amber-100/80 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400'
    },
    indigo: {
      bg: 'bg-indigo-100/80 dark:bg-indigo-900/30',
      text: 'text-indigo-600 dark:text-indigo-400'
    }
  };

  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ y: -2 }}
        className="h-full"
      >
        <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-full ${colorVariants[color].bg} ${colorVariants[color].text}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              {loading ? (
                <>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{value}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{description}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

const SectionCard = ({ title, children, actionText, actionLink, loading }: SectionCardProps) => {
  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
      <CardHeader className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </CardTitle>
          {actionText && actionLink && !loading && (
            <Link 
              href={actionLink} 
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              {actionText}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
          {loading && <Skeleton className="h-4 w-16" />}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const statusVariants = {
    confirmé: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    terminé: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    annulé: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'à venir': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/dashboard/patient/appointments/${appointment.id}`}>
        <div className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-700">
              <AvatarImage src={appointment.avatar} />
              <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {appointment.doctor}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.specialty}
                  </p>
                </div>
                <Badge className={statusVariants[appointment.status]}>
                  {appointment.status}
                </Badge>
              </div>
              
              <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1.5" />
                {appointment.date}
              </div>
              
              {appointment.location && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 truncate">
                  {appointment.location}
                </p>
              )}
            </div>
          </div>
          
          {appointment.notes && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

const MedicalRecordCard = ({ record }: MedicalRecordCardProps) => {
  return (
    <motion.div 
      whileHover={{ x: 2 }}
      className="group"
    >
      <Link href={`/dashboard/patient/medical-records/${record.id}`}>
        <div className="p-4 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {record.icon || <FileText className="w-4 h-4" />}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {record.type}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {record.description}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {record.date}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {record.doctor}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const QuickAction = ({ action }: QuickActionProps) => {
  const colorVariants = {
    emerald: {
      bg: 'bg-emerald-100/80 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    blue: {
      bg: 'bg-blue-100/80 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400'
    },
    purple: {
      bg: 'bg-purple-100/80 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400'
    },
    indigo: {
      bg: 'bg-indigo-100/80 dark:bg-indigo-900/30',
      text: 'text-indigo-600 dark:text-indigo-400'
    }
  };

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link href={action.href}>
        <div className="p-3 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${colorVariants[action.color as keyof typeof colorVariants].bg} ${colorVariants[action.color as keyof typeof colorVariants].text}`}>
            {action.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {action.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {action.description}
            </p>
          </div>
          
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      </Link>
    </motion.div>
  );
};

const ReminderCard = ({ reminder }: ReminderCardProps) => {
  const colorVariants = {
    amber: {
      bg: 'bg-amber-100/80 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-200/50 dark:bg-amber-800/30'
    },
    blue: {
      bg: 'bg-blue-100/80 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-200/50 dark:bg-blue-800/30'
    },
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }}>
      <div className={`p-4 rounded-lg ${colorVariants[reminder.color as keyof typeof colorVariants].bg}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorVariants[reminder.color as keyof typeof colorVariants].iconBg} ${colorVariants[reminder.color as keyof typeof colorVariants].text}`}>
            {reminder.icon}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {reminder.title}
            </h3>
            <p className={`text-xs ${colorVariants[reminder.color as keyof typeof colorVariants].text} mt-1`}>
              {reminder.date}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};