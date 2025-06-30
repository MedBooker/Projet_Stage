'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Stethoscope, MapPin, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

type Appointment = {
  id: string;
  date: string;
  doctor: string;
  creneau: string;
  idCreneau: string;
  specialty: string;
  status: string;
  location: string;
  avatar?: string;
  notes?: string;
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
  });

  useEffect(() => {
    const getAppointments = async () => {
    try {
      const response = await fetch ('http://127.0.0.1:8000/api/Patients/get-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
       const formattedAppointments = data.map((appt: any) => ({
        id: appt.id,  
        date: appt.date,  
        doctor: appt.medecin,
        creneau: appt.creneau,
        idCreneau: appt.idCreneau,
        specialty: appt.specialite,
        status: appt.status || 'upcoming',
        location: 'Clinique de l\'Amitié, Dakar',
        notes: 'Prévoir un examen clinique complet',
      }));
      setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching specialities:", error);
      }
    };
    getAppointments();
  }, [token]);

  const handleCancelAppointment = async (id: string, idCreneau: string) => {
    // setAppointments(appointments.map(appt => 
    //   appt.id === id ? { ...appt, status: 'cancelled', notes: 'Rendez-vous annulé' } : appt
    // ));
    
    const response = await fetch(`http://127.0.0.1:8000/api/Patients/delete-appointments`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ id, idCreneau }),
    });
    console.log('test', idCreneau);
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du rendez-vous');
    }
    setAppointments(appointments.filter(appt => appt.id !== id));
    toast.success("Rendez-vous annulé", {
      description: "Votre rendez-vous a été annulé avec succès",
    });
  };

  const handleReschedule = async (id: string) => {
    router.push(`/appointments/reschedule/${id}`);
  };

  const statusMap = {
    upcoming: { label: 'À venir', variant: 'default' },
    completed: { label: 'Passé', variant: 'secondary' },
    cancelled: { label: 'Annulé', variant: 'destructive' }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-emerald-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mes Rendez-vous</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Consultez et gérez vos rendez-vous médicaux
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/patient/appointments/new" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Nouveau rendez-vous
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {appointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Number(appt.id) * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row justify-between items-start pb-3 space-y-0">
                  <div className="flex items-center space-x-4">
                    {'avatar' in appt ? (
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img src={appt.avatar} alt={appt.doctor} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{appt.doctor}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{appt.specialty}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleReschedule(appt.id)}>
                        Reprogrammer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleCancelAppointment(appt.id, appt.idCreneau)}
                        className="text-red-600 dark:text-red-400"
                        disabled={appt.status !== 'upcoming'}
                      >
                        Annuler
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(appt.date)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {appt.creneau}  
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {appt.location}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Badge
                      variant={statusMap[appt.status as keyof typeof statusMap].variant as any}
                      className="capitalize"
                    >
                      {statusMap[appt.status as keyof typeof statusMap].label}
                    </Badge>
                    
                    {appt.status === 'upcoming' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReschedule(appt.id)}
                        >
                          Reprogrammer
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelAppointment(appt.id, appt.idCreneau)}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>

                  {appt.notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                      {appt.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {appointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Aucun rendez-vous prévu
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md text-center">
              Vous n'avez aucun rendez-vous à venir. Prenez rendez-vous avec un professionnel de santé.
            </p>
            <Button asChild>
              <Link href="/appointments/new" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Prendre rendez-vous
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}