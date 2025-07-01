'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, FileText, Stethoscope, FileSearch, UploadCloud, File, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  type: z.enum(['prescription', 'report', 'scan', 'other']),
  date: z.string().min(1, 'La date est requise'),
  doctor: z.string().min(3, 'Le nom du médecin est requis'),
  notes: z.string().optional(),
  file: z
    .any()
    .refine(
      (val) =>
        typeof window === 'undefined' ||
        val === undefined ||
        (typeof File !== 'undefined' && val instanceof File),
      { message: 'Le fichier doit être un fichier valide' }
    )
    .optional(),
});

type MedicalRecord = {
  id: string;
  title: string;
  type: 'prescription' | 'report' | 'scan' | 'other';
  date: string;
  doctor: string;
  fileUrl?: string;
  notes?: string;
};

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'prescription',
      date: new Date().toISOString().split('T')[0],
      doctor: '',
      notes: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData: MedicalRecord[] = [
          {
            id: '1',
            title: 'Ordonnance du 15/01/2024',
            type: 'prescription',
            date: '2024-01-15',
            doctor: 'Dr. Hubert',
            fileUrl: '/documents/prescription.pdf',
          },
          {
            id: '2',
            title: 'Radiologie pulmonaire',
            type: 'scan',
            date: '2023-12-10',
            doctor: 'Dr. DIALLO',
            notes: 'Aucune anomalie détectée',
          },
        ];
        setRecords(mockData);
      } catch (error) {
        toast.error('Erreur de chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue('file', undefined);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        title: values.title,
        type: values.type,
        date: values.date,
        doctor: values.doctor,
        notes: values.notes,
        fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
      };

      setRecords([...records, newRecord]);
      toast.success('Document ajouté avec succès');
      setIsModalOpen(false);
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecords(records.filter(record => record.id !== id));
      toast.success('Document supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prescription': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'report': return <FileSearch className="w-5 h-5 text-green-500" />;
      case 'scan': return <Stethoscope className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dossier Médical</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique Médical</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && records.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Aucun document médical</h3>
              <p className="mt-1 text-gray-500">
                Commencez par ajouter votre premier document
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Médecin</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="flex items-center gap-2">
                      {getTypeIcon(record.type)}
                      <span className="capitalize">
                        {record.type === 'prescription' ? 'Ordonnance' : 
                         record.type === 'report' ? 'Compte-rendu' : 
                         record.type === 'scan' ? 'Examen' : 'Autre'}
                      </span>
                    </TableCell>
                    <TableCell>{record.title}</TableCell>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{record.doctor}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => record.fileUrl && window.open(record.fileUrl, '_blank')}
                        disabled={!record.fileUrl}
                      >
                        Voir
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        disabled={isLoading}
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un document médical</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Titre</label>
              <Input 
                placeholder="Ordonnance du 15/01/2024" 
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Type</label>
                <Select 
                  onValueChange={(value) => form.setValue('type', value as any)}
                  defaultValue={form.watch('type')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescription">Ordonnance</SelectItem>
                    <SelectItem value="report">Compte-rendu</SelectItem>
                    <SelectItem value="scan">Résultat d'examen</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  {...form.register('date')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Médecin</label>
              <Input 
                placeholder="Dr. Dupont" 
                {...form.register('doctor')}
              />
              {form.formState.errors.doctor && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.doctor.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Notes (optionnel)</label>
              <Textarea
                placeholder="Informations complémentaires..."
                className="resize-none"
                {...form.register('notes')}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Fichier (optionnel)</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg hover:bg-gray-50 transition">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {selectedFile ? 'Changer de fichier' : 'Téléverser un fichier'}
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                </label>
                
                {selectedFile && (
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <File className="w-5 h-5 text-gray-500" />
                    <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5"
                      onClick={removeFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}