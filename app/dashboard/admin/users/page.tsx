'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Medecin {
  id: string;
  prenom: string;
  nom: string;
  adresseMail: string;
  specialite: string;
  statut: 'actif' | 'inactif';
}

export default function UsersPage() {
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const token = sessionStorage.getItem('auth_token');
        const response = await fetch('${process.env.NEXT_PUBLIC_BACKEND_URL}/Admin/get-medecins', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        setMedecins(data);
      } catch (error) {
        toast.error("Erreur", {
          description: "Impossible de charger les médecins",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMedecins();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      const token = sessionStorage.getItem('auth_token');
      console.log('test', id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Admin/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) throw new Error('Échec de la mise à jour');
      
      const result = await response.json();
      
      setMedecins(medecins.map(medecin => 
        medecin.id === id ? {...medecin, statut: result.new_status} : medecin
      ));
      
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de modifier le statut",
      });
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Liste des Médecins</h2>
      <a href="http://localhost:3000/dashboard/admin/users/new" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors mb-4 inline-block">
        Ajouter un médecin
      </a>
      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="p-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                <th>Nom</th>
                <th>Spécialité</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {medecins.map((medecin) => (
                <tr key={medecin.id} className="text-sm">
                  <td className="py-3">Dr. {medecin.prenom} {medecin.nom}</td>
                  <td>{medecin.specialite}</td>
                  <td>{medecin.adresseMail}</td>
                  <td>
                    <Badge variant="default" className={`capitalize ${
                      medecin.statut === 'actif' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                    }`}>
                      {medecin.statut}


                    </Badge>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleStatus(medecin.id)}
                      className={`px-3 py-1 rounded ${
                        medecin.statut === 'actif'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {medecin.statut === 'actif' ? 'Désactivé' : 'Activé'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}