'use client';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, FileText, Stethoscope, FileSearch, User, ArrowLeft, UploadCloud, File, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';

const formSchema = z.object({
  patient_id: z.string(),
  appointment_id: z.string(),
  patient_name: z.string().min(1, "Le nom du patient est requis"),
  appointment_date: z.string(),
  diagnosis: z.string().min(3, 'Le diagnostic doit contenir au moins 3 caractères'),
  prescription: z.string().min(3, 'La prescription doit contenir au moins 3 caractères'),
  notes: z.string().optional(),
});

type MedicalDocument = {
  id: string;
  name: string;
  type: string;
  path: string;
  uploaded_at: string;
};

type MedicalRecord = {
  id?: string;
  patient_id: string;
  appointment_id: string;
  patient_name: string;
  appointment_date: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
  documents?: MedicalDocument[];
};

export default function DoctorMedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      appointment_id: '',
      diagnosis: '',
      patient_name: '', 
      appointment_date: '',
      prescription: '',
      notes: '',
    },
  });

  useEffect(() => {
    const authToken = sessionStorage.getItem('auth_token');
    setToken(authToken);
    
    if (authToken) {
      fetchData(authToken);
    } else {
      toast.error("Authentification requise");
      window.location.href = '/login';
    }
  }, []);

  const fetchData = async (token: string) => {
    try {
      setIsLoading(true);
      
      const appointmentsResponse = await fetch('http://127.0.0.1:8000/api/Medecins/get-appointments', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json', 
        },
      });
      
      if (!appointmentsResponse.ok) throw new Error('Erreur de chargement des rendez-vous');
      
      const appointmentsData = await appointmentsResponse.json();
      const completed = appointmentsData.filter((app: any) => app.statut === 'completed');
      setCompletedAppointments(completed);
      
      const recordsResponse = await fetch('http://127.0.0.1:8000/api/Medecins/get-medical-records', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',  
        },
      });
      
      if (recordsResponse.ok) {
        const data = await recordsResponse.json();
        const getRecords: MedicalRecord[] = data.map((item: any) => ({
          id: item.id,
          patient_id: item.idPatient,
          appointment_id: item.idRdv ?? '',
          diagnosis: item.diagnostic,
          patient_name: item.nomPatient,
          appointment_date: item.dateRdv,
          prescription: item.prescription,
          notes: item.notes,
          documents: item.documents || [],
        }))
         setRecords(getRecords);
      };
       
    } catch (error) {
      toast.error('Erreur de chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRecord) {
      form.reset({
        patient_id: selectedRecord.patient_id,
        appointment_id: selectedRecord.appointment_id,
        diagnosis: selectedRecord.diagnosis,
        patient_name: selectedRecord.patient_name, 
        appointment_date: selectedRecord.appointment_date, 
        prescription: selectedRecord.prescription,
        notes: selectedRecord.notes || '',
      });
      setFiles([]);
    }
  }, [selectedRecord, form]);

  const handleSelectRecord = (appointment: any) => {
    const existingRecord = records.find(r => r.appointment_id === appointment.id);
    
    if (existingRecord) {
      setSelectedRecord(existingRecord);
    } else {
      setSelectedRecord({
        patient_id: appointment.idPatient,
        appointment_id: appointment.id,
        patient_name: appointment.prenomNom,
        appointment_date: appointment.date,
        diagnosis: '',
        prescription: '',
        notes: '',
        documents: [],
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('patient_id', values.patient_id);
      formData.append('appointment_id', values.appointment_id);
      formData.append('diagnosis', values.diagnosis);
      formData.append('prescription', values.prescription);
      formData.append('patient_name', values.patient_name); 
      formData.append('appointment_date', values.appointment_date); 
      formData.append('notes', values.notes || '');
      files.forEach(file => {
        formData.append('documents[]', file);
      });
      if (selectedRecord?.id) {
        formData.append('idRecord', selectedRecord.id); 
      }
      
      const url = selectedRecord?.id 
        ? 'http://127.0.0.1:8000/api/Medecins/update-medical-record'
        : 'http://127.0.0.1:8000/api/Medecins/create-medical-record';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) throw new Error('Erreur de sauvegarde du dossier');
      
      const data = await response.json();
      
      const updatedRecord: MedicalRecord = {
        id: data.id,
        patient_id: data.idPatient,
        appointment_id: data.idRdv,
        patient_name: data.nomPatient,
        appointment_date: data.dateRdv,
        diagnosis: data.diagnostic,
        prescription: data.prescription,
        notes: data.notes,
        documents: data.documents || [],
      };
      if (selectedRecord?.id) {
        setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
      } else {
        setRecords([...records, updatedRecord]);
      }
      
      toast.success('Dossier médical enregistré avec succès');
      setSelectedRecord(updatedRecord);
      setFiles([]);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du dossier");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/Medecins/delete-file`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',  
        },
        body: JSON.stringify({ documentId })
      });
      
      if (!response.ok) throw new Error('Erreur de suppression');
      
      if (selectedRecord) {
        const updatedRecord = {
          ...selectedRecord,
          documents: selectedRecord.documents?.filter(doc => doc.id !== documentId),
        };
        setSelectedRecord(updatedRecord);
        setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
        toast.success('Document supprimé avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression du document');
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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Documents médicaux</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRecord.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        Ajouté le {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`http://localhost:8000/storage/${doc.path}`, '_blank')}
                    >
                      Voir
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <label className="block text-sm font-medium">Ajouter des documents</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg hover:bg-gray-50 transition">
                      <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {files.length ? 'Ajouter plus de fichiers' : 'Téléverser des documents'}
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        multiple
                      />
                    </div>
                  </label>
                  
                  {files.length > 0 && (
                    <div className="flex-1 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <File className="w-5 h-5 text-gray-500" />
                          <span className="text-sm truncate flex-1">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-5 h-5"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Formats acceptés : PDF, Word, JPG, PNG (max 10MB par fichier)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedRecord(null)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
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
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedAppointments.map((appointment) => {
                  const hasRecord = records.some(r => r.appointment_id === appointment.id);
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.prenomNom}
                      </TableCell>
                      <TableCell>
                        {new Date(appointment.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {appointment.time}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          hasRecord 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {hasRecord ? 'Dossier complet' : 'À compléter'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleSelectRecord(appointment)}>
                          {hasRecord ? 'Voir/Mettre à jour' : 'Créer dossier'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}