'use client';
import { useState, useEffect } from 'react';
import { FileText, Stethoscope, FileSearch, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

type MedicalDocument = {
  id: string;
  name: string;
  path: string;
  type: string;
  date: string;
  doctor: string;
};

export default function PatientMedicalRecordsPage() {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<MedicalDocument | null>(null);
  const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
  }, []);

  const fetchMedicalDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/Patients/medical-documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      setDocuments(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalDocuments();
  }, []);

  const downloadDocument = async (documentId: string) => {
    try {
      const response = await axios.get(`/api/Patients/documents/${documentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documents.find(doc => doc.id === documentId)?.name || 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Documents Médicaux</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="text-blue-500" />
            <span>Ordonnances et résultats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Aucun document médical</h3>
              <p className="mt-1 text-gray-500">
                Vos ordonnances et résultats d'examens apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="flex items-center gap-2">
                        {document.type.includes('prescription') ? (
                          <FileText className="w-5 h-5 text-blue-500" />
                        ) : document.type.includes('report') ? (
                          <FileSearch className="w-5 h-5 text-green-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-500" />
                        )}
                        <span>
                          {document.type.includes('prescription') 
                            ? 'Ordonnance' 
                            : document.type.includes('report') 
                            ? 'Compte-rendu' 
                            : 'Document'}
                        </span>
                      </TableCell>
                      <TableCell>{document.name}</TableCell>
                      <TableCell>
                        {new Date(document.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{document.doctor}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadDocument(document.id)}
                        >
                          Télécharger
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedDocument.name}</h3>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="border rounded-lg p-4">
              <iframe 
                src={`/api/Patients/documents/${selectedDocument.id}/view`}
                className="w-full h-[70vh]"
                title={selectedDocument.name}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => downloadDocument(selectedDocument.id)}>
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}