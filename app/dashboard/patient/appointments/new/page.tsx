'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const doctors = [
  {
    id: 'sophie',
    name: 'Dr. Ibrahima DIALLO',
    specialty: 'Cardiologie',
    availability: ['Lundi', 'Mercredi', 'Vendredi']
  },
  {
    id: 'jean',
    name: 'Dr. Moussa NDIAYE',
    specialty: 'Dermatologie',
    availability: ['Mardi', 'Jeudi']
  },
  {
    id: 'camille',
    name: 'Dr. Elisabeth CAMARA',
    specialty: 'Pédiatrie',
    availability: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  }
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', 
  '14:00', '15:00', '16:00', '17:00'
];

export default function NewAppointmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'doctor') {
      const doctor = doctors.find(d => d.id === value);
      setSelectedDoctor(doctor);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!formData.doctor || !formData.date || !formData.time) {
        toast.error("Informations manquantes", {
          description: "Veuillez sélectionner un médecin, une date et une heure",
        });
        return;
      }

      toast.success("Rendez-vous confirmé", {
        description: `Votre rendez-vous avec ${selectedDoctor?.name} est confirmé pour le ${formData.date} à ${formData.time}`,
      });

      setTimeout(() => router.push('/dashboard/patient/appointments'), 1500);
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la prise de rendez-vous",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-emerald-950 dark:to-gray-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prendre un Rendez-vous</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sélectionnez un médecin et choisissez une disponibilité
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="doctor" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Médecin
              </Label>
              <Select onValueChange={(value) => handleChange('doctor', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un médecin" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p>{doctor.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{doctor.specialty}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedDoctor && (
                <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Disponibilités : {selectedDoctor.availability.join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Heure
                </Label>
                <Select onValueChange={(value) => handleChange('time', value)} disabled={!formData.date}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="reason">Motif de consultation</Label>
              <Textarea
                id="reason"
                placeholder="Décrivez brièvement votre motif de consultation..."
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirmation en cours...
                </span>
              ) : (
                'Confirmer le rendez-vous'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}