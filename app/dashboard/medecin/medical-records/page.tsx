'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, FileText, Stethoscope, FileSearch, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  patient_id: z.string(),
  appointment_id: z.string(),
  diagnosis: z.string().min(3, 'Le diagnostic doit contenir au moins 3 caractères'),
  prescription: z.string().min(3, 'La prescription doit contenir au moins 3 caractères'),
  notes: z.string().optional(),
});

type MedicalRecord = {
  id?: string;
  patient_id: string;
  appointment_id: string;
  patient_name: string;
  appointment_date: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export default function DoctorMedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      appointment_id: '',
      diagnosis: '',
      prescription: '',
      notes: '',
    },
  });
    const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const authToken = sessionStorage.getItem('auth_token');
    setToken(authToken);
    
    if (authToken) {
      fetch(authToken);
    } else {
      toast.error("Authentification requise");
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/Medecins/get-appointments', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
          },
        });
        
        if (!response.ok) throw new Error('Erreur de chargement');
        
        const data = await response.json();
        const completed = data.filter((app: any) => app.status === 'completed');
        setCompletedAppointments(completed);
        
        const recordsResponse = await fetch('/api/medical-records', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
          },
        });
        
        if (recordsResponse.ok) {
          const recordsData = await recordsResponse.json();
          setRecords(recordsData);
        }
      } catch (error) {
        toast.error('Erreur de chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedAppointments();
  }, []);

  useEffect(() => {
    if (selectedRecord) {
      form.reset({
        patient_id: selectedRecord.patient_id,
        appointment_id: selectedRecord.appointment_id,
        diagnosis: selectedRecord.diagnosis,
        prescription: selectedRecord.prescription,
        notes: selectedRecord.notes || '',
      });
    }
  }, [selectedRecord, form]);

  const handleSelectRecord = (appointment: any) => {
    const existingRecord = records.find(r => r.appointment_id === appointment.id);
    
    if (existingRecord) {
      setSelectedRecord(existingRecord);
    } else {
      setSelectedRecord({
        patient_id: appointment.patient_id,
        appointment_id: appointment.id,
        patient_name: appointment.patient_name,
        appointment_date: appointment.date,
        diagnosis: '',
        prescription: '',
        notes: '',
      });
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const url = selectedRecord?.id 
        ? `/api/medical-records/${selectedRecord.id}`
        : '/api/medical-records';
      
      const method = selectedRecord?.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) throw new Error('Erreur de sauvegarde');
      
      const data = await response.json();
      
      if (selectedRecord?.id) {
        setRecords(records.map(r => r.id === data.id ? data : r));
      } else {
        setRecords([...records, data]);
      }
      
      toast.success('Dossier médical enregistré avec succès');
      setSelectedRecord(data);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du dossier");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (selectedRecord) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => setSelectedRecord(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Dossier Médical</h1>
            <p className="text-lg text-gray-600">{selectedRecord.patient_name}</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>Informations du patient</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date de consultation</p>
                <p className="font-medium">
                  {new Date(selectedRecord.appointment_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID Patient</p>
                <p className="font-medium">{selectedRecord.patient_id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                <span>Diagnostic et traitement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Diagnostic</label>
                <Textarea
                  {...form.register('diagnosis')}
                  className="min-h-[100px]"
                  placeholder="Entrez le diagnostic..."
                />
                {form.formState.errors.diagnosis && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.diagnosis.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prescription</label>
                <Textarea
                  {...form.register('prescription')}
                  className="min-h-[100px]"
                  placeholder="Ex: 1 comprimé matin et soir pendant 5 jours..."
                />
                {form.formState.errors.prescription && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.prescription.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes complémentaires</label>
                <Textarea
                  {...form.register('notes')}
                  className="min-h-[100px]"
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {selectedRecord.id ? 'Mettre à jour' : 'Créer le dossier'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dossiers Médicaux</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Consultations effectuées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Aucune consultation effectuée</h3>
              <p className="mt-1 text-gray-500">
                Les dossiers apparaîtront ici après avoir marqué un rendez-vous comme "effectué"
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {appointment.patient_name}
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {appointment.time}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleSelectRecord(appointment)}>
                        {records.some(r => r.appointment_id === appointment.id) 
                          ? 'Voir le dossier' 
                          : 'Créer un dossier'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}