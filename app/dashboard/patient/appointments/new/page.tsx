'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Stethoscope, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const specialties = [
  "Cardiologie",
  "Dermatologie",
  "Pédiatrie",
  "Gynécologie",
  "Neurologie",
  "Orthopédie"
];

const doctors = [
  {
    id: 'diallo',
    name: 'Dr. Ibrahima DIALLO',
    specialty: 'Cardiologie',
    availability: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: 'ndiaye',
    name: 'Dr. Moussa NDIAYE',
    specialty: 'Dermatologie',
    availability: ['Tuesday', 'Thursday']
  },
  {
    id: 'camara',
    name: 'Dr. Elisabeth CAMARA',
    specialty: 'Pédiatrie',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
];

const timeSlots = Array.from({ length: 16 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const formSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    email: z.string().email("Veuillez entrer un email valide"),
    phone: z.string().min(10, "Le numéro doit contenir au moins 10 chiffres").optional(),
  }),
  appointmentInfo: z.object({
    specialty: z.string().min(1, "Veuillez sélectionner une spécialité"),
    doctor: z.string().min(1, "Veuillez sélectionner un médecin"),
    date: z.string().min(1, "Veuillez sélectionner une date"),
    time: z.string().min(1, "Veuillez sélectionner une heure"),
  }),
  reason: z.string().min(10, "Veuillez décrire brièvement votre motif (au moins 10 caractères)"),
});

type FormData = z.infer<typeof formSchema>;

export default function NewAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: ''
      },
      appointmentInfo: {
        specialty: '',
        doctor: '',
        date: '',
        time: ''
      },
      reason: ''
    }
  });

  const today = new Date().toISOString().split('T')[0];

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
    setValue('appointmentInfo.specialty', value);
    const filtered = doctors.filter(d => d.specialty === value);
    setFilteredDoctors(filtered);
    setValue('appointmentInfo.doctor', '');
    setSelectedDoctor(null);
    setValue('appointmentInfo.date', '');
    setValue('appointmentInfo.time', '');
    setAvailableTimes([]);
  };

  const handleDoctorChange = (value: string) => {
    setValue('appointmentInfo.doctor', value);
    const doctor = doctors.find(d => d.id === value);
    setSelectedDoctor(doctor);
    setValue('appointmentInfo.date', '');
    setValue('appointmentInfo.time', '');
    setAvailableTimes([]);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setValue('appointmentInfo.date', date);
    setValue('appointmentInfo.time', '');
    
    if (selectedDoctor && date) {
      const selectedDate = new Date(date);
      const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (selectedDoctor.availability.includes(dayName)) {
        const availableTimes = timeSlots
          .filter((_, index) => index % 3 !== 0) 
          .map(time => time);
        
        setAvailableTimes(availableTimes);
      } else {
        setAvailableTimes([]);
        toast.warning("Indisponible", {
          description: `Dr. ${selectedDoctor.name} ne travaille pas le ${selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' })}`,
        });
      }
    } else {
      setAvailableTimes([]);
    }
  };

  const nextStep = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await trigger('personalInfo');
    } else if (step === 2) {
      isValid = await trigger('appointmentInfo');
    }
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Rendez-vous confirmé", {
        description: (
          <div className="space-y-2">
            <p>Patient: {data.personalInfo.fullName}</p>
            <p>Médecin: {selectedDoctor?.name} ({data.appointmentInfo.specialty})</p>
            <p>Date: {new Date(data.appointmentInfo.date).toLocaleDateString('fr-FR')} à {data.appointmentInfo.time}</p>
            <p>Motif: {data.reason}</p>
          </div>
        ),
      });

      setTimeout(() => router.push('/dashboard/patient/appointments'), 2000);
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la prise de rendez-vous",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const appointmentDate = watch('appointmentInfo.date');
  const selectedDay = appointmentDate ? new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' }) : null;
  const isDoctorAvailable = selectedDoctor && appointmentDate 
    ? selectedDoctor.availability.includes(selectedDay)
    : false;

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
            
            <div className="flex justify-center mt-6 mb-4">
              <div className="flex items-center">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === stepNumber
                          ? 'bg-emerald-600 text-white'
                          : step > stepNumber
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-12 h-1 ${step > stepNumber ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400">
              {step === 1 && "Informations personnelles"}
              {step === 2 && "Spécialité et date"}
              {step === 3 && "Motif de consultation"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="fullName">
                    Nom complet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Votre nom complet"
                    {...register('personalInfo.fullName')}
                  />
                  {errors.personalInfo?.fullName && (
                    <p className="text-sm text-red-500">{errors.personalInfo.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    {...register('personalInfo.email')}
                  />
                  {errors.personalInfo?.email && (
                    <p className="text-sm text-red-500">{errors.personalInfo.email.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+221 77 123 45 67"
                    {...register('personalInfo.phone')}
                  />
                  {errors.personalInfo?.phone && (
                    <p className="text-sm text-red-500">{errors.personalInfo.phone.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="specialty">
                    Spécialité <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    onValueChange={handleSpecialtyChange} 
                    value={watch('appointmentInfo.specialty')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.appointmentInfo?.specialty && (
                    <p className="text-sm text-red-500">{errors.appointmentInfo.specialty.message}</p>
                  )}
                </div>

                {watch('appointmentInfo.specialty') && (
                  <div className="space-y-3">
                    <Label htmlFor="doctor">
                      Médecin <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      onValueChange={handleDoctorChange} 
                      value={watch('appointmentInfo.doctor')}
                      disabled={!watch('appointmentInfo.specialty')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un médecin" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDoctors.map((doctor) => (
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
                    {errors.appointmentInfo?.doctor && (
                      <p className="text-sm text-red-500">{errors.appointmentInfo.doctor.message}</p>
                    )}
                    
                    {selectedDoctor && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          {selectedDoctor.availability.map((day: string) => {
                            const daysMap: Record<string, string> = {
                              'Monday': 'Lundi',
                              'Tuesday': 'Mardi',
                              'Wednesday': 'Mercredi',
                              'Thursday': 'Jeudi',
                              'Friday': 'Vendredi'
                            };
                            return daysMap[day] || day;
                          }).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="date">
                      Date préférée <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={watch('appointmentInfo.date')}
                      onChange={handleDateChange}
                    />
                    {errors.appointmentInfo?.date && (
                      <p className="text-sm text-red-500">{errors.appointmentInfo.date.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="time">
                      Heure préférée <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      onValueChange={(value) => setValue('appointmentInfo.time', value)}
                      value={watch('appointmentInfo.time')}
                      disabled={!watch('appointmentInfo.date') || availableTimes.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !watch('appointmentInfo.date') 
                            ? "Sélectionnez une date" 
                            : availableTimes.length === 0 
                            ? "Aucun créneau disponible" 
                            : "Sélectionnez une heure"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.appointmentInfo?.time && (
                      <p className="text-sm text-red-500">{errors.appointmentInfo.time.message}</p>
                    )}
                  </div>
                </div>

                {selectedDoctor && appointmentDate && (
                  <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                    isDoctorAvailable
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {isDoctorAvailable ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>
                          Dr. {selectedDoctor.name} est disponible le {new Date(appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span>
                          Dr. {selectedDoctor.name} n'est pas disponible le {new Date(appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="reason">Motif de consultation</Label>
                  <Textarea
                    id="reason"
                    placeholder="Décrivez brièvement le motif de votre consultation..."
                    {...register('reason')}
                    rows={4}
                  />
                  {errors.reason && (
                    <p className="text-sm text-red-500">{errors.reason.message}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ex: Consultation de routine, douleurs, contrôle...
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Patient:</span> {watch('personalInfo.fullName')}</p>
                    <p><span className="font-medium">Spécialité:</span> {watch('appointmentInfo.specialty')}</p>
                    {selectedDoctor && (
                      <p><span className="font-medium">Médecin:</span> {selectedDoctor.name}</p>
                    )}
                    <p><span className="font-medium">Date:</span> {new Date(watch('appointmentInfo.date')).toLocaleDateString('fr-FR')}</p>
                    <p><span className="font-medium">Heure:</span> {watch('appointmentInfo.time')}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </Button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className=" bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 "
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
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}