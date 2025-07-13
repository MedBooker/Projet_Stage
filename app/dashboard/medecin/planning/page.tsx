'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';  

interface Creneau {
  idCreneau: string;
  jour: string;
  heureDebut: string;
  heureFin: string;
  nbreLimitePatient: number;
  est_disponible: boolean;
}

interface CreneauGroupe {
  id: string;
  idMedecin: string;
  jours: Creneau[];
}

export default function PlanningPage() {
  const [groupesCreneaux, setGroupesCreneaux] = useState<CreneauGroupe[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCreneaux, setNewCreneaux] = useState([{
    jour: '',
    heureDebut: '',
    heureFin: '',
    nbreLimitePatient: 5
  }]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const authToken = sessionStorage.getItem('auth_token');
    setToken(authToken);
    
    if (authToken) {
      fetchCreneaux(authToken);
    } else {
      toast.error("Authentification requise");
      window.location.href = '/login';
    }
  }, []);

const fetchCreneaux = async (authToken: string) => {
  setLoading(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Medecins/get-schedule`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Erreur de chargement');
    
    const data: CreneauGroupe[] = await response.json();
    setGroupesCreneaux(data);
    
  } catch (error) {
    console.error('Fetch error:', error);
    toast.error("Erreur de chargement des créneaux");
    setGroupesCreneaux([]);
  } finally {
    setLoading(false);
  }
};

  const handleAddCreneau = () => {
    setNewCreneaux([
      ...newCreneaux,
      { jour: '', heureDebut: '', heureFin: '', nbreLimitePatient: 5 }
    ]);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    if (!token) {
      toast.error("Authentification requise");
      setSubmitting(false);
      return;
    }

    for (let creneau of newCreneaux) {
      if (!creneau.jour || !creneau.heureDebut || !creneau.heureFin) {
        toast.error("Veuillez remplir tous les champs");
        setSubmitting(false);
        return;
      }
      if (creneau.heureDebut >= creneau.heureFin) {
        toast.error("L'heure de fin doit être après l'heure de début");
        setSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Medecins/add-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({creneaux: newCreneaux})
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          toast.error("Conflit de créneau", {
            description: data.message,
          });
        } else {
          throw new Error(data.message || "Erreur lors de l'ajout");
        }
        return;
      }

      toast.success(data.message || "Créneau ajouté avec succès !");
      setNewCreneaux([{
        jour: '',
        heureDebut: '',
        heureFin: '',
        nbreLimitePatient: 5
      }]);
      
      await fetchCreneaux(token!);
    } catch (err) {
      console.error('Erreur:', err);
      toast.error("Erreur", {
        description: err instanceof Error ? err.message : "Erreur de connexion au serveur",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (groupeId: string, creneauId: string) => {
    if (!token) {
      toast.error("Authentification requise");
      return;
    }
    console.log(groupeId);
    if (!confirm("Voulez-vous vraiment supprimer ce créneau ?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Medecins/delete-schedule`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idCreneau: creneauId, id: groupeId })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast.success("Créneau supprimé avec succès");
      await fetchCreneaux(token);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
      });
    }
  };

  const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const allCreneaux = (groupesCreneaux || []).flatMap(groupe => 
  (groupe?.jours || []).map(creneau => ({
    ...creneau,
    groupeId: groupe?.id || ''
  }))
);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Créneaux</h1>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </CardContent>
            <CardFooter>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Créneaux</h1>
        <Button 
          variant="outline" 
          onClick={() => fetchCreneaux(token!)}
          disabled={loading}
        >
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un créneau</CardTitle>
            <CardDescription>
              Configurez vos disponibilités hebdomadaires
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAdd}>
            {newCreneaux.map((creneau, index) => (
              <div key={index} className="space-y-4">
                {/* Sélecteur de jour */}
                <Select
                  value={creneau.jour}
                  onValueChange={(value) => {
                    const updatedCreneaux = [...newCreneaux];
                    updatedCreneaux[index].jour = value;
                    setNewCreneaux(updatedCreneaux);
                  }}
                >
                  <SelectTrigger className="my-3 mx-3">
                    <SelectValue placeholder="Sélectionnez un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {joursSemaine.map((jour) => (
                      <SelectItem key={jour} value={jour}>
                        {jour.charAt(0).toUpperCase() + jour.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Heure début */}
                <div className="my-3 mx-5">
                <label className="block text-sm font-medium mb-1">Heure début</label>
                <Input
                  type="time"
                  value={creneau.heureDebut}
                  onChange={(e) => {
                    const updatedCreneaux = [...newCreneaux];
                    updatedCreneaux[index].heureDebut = e.target.value;
                    setNewCreneaux(updatedCreneaux);
                  }}
                />
                </div>

                {/* Heure fin */}
                <div className="my-3 mx-5">
                <label className="block text-sm font-medium mb-1">Heure fin</label>
                <Input
                  type="time"
                  value={creneau.heureFin}
                  onChange={(e) => {
                    const updatedCreneaux = [...newCreneaux];
                    updatedCreneaux[index].heureFin = e.target.value;
                    setNewCreneaux(updatedCreneaux);
                  }}
                />
                </div>

                {/* Nombre limite de patients */}
                <div className="my-3 mx-5">
                <label className="block text-sm font-medium mb-1">Nombre max de patients</label>
                <Input
                  type="number"
                  min="1"
                  value={creneau.nbreLimitePatient}
                  onChange={(e) => {
                    const updatedCreneaux = [...newCreneaux];
                    updatedCreneaux[index].nbreLimitePatient = parseInt(e.target.value, 10);
                    setNewCreneaux(updatedCreneaux);
                  }}
                />
                </div>
              </div>
            ))}

            {/* Ajouter un autre créneau */}
            <Button type="button" onClick={handleAddCreneau} className="mx-3">
              Ajouter un autre créneau
            </Button>

            {/* Soumettre les créneaux */}
            <Button type="submit" disabled={submitting} className="mx-5">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  En cours...
                </>
              ) : 'Ajouter les créneaux'}
            </Button> 
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vos créneaux programmés</CardTitle>
            <CardDescription>
              {allCreneaux.length} créneau{allCreneaux.length > 1 ? 'x' : ''} actif{allCreneaux.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {allCreneaux.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun créneau programmé</p>
                <Button 
                  variant="ghost" 
                  className="mt-4 text-emerald-600"
                  onClick={() => fetchCreneaux(token!)}
                >
                  Actualiser
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {allCreneaux.map((creneau) => (
                  <li 
                    key={`${creneau.groupeId}-${creneau.idCreneau}`} 
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {creneau.jour.charAt(0).toUpperCase() + creneau.jour.slice(1)} • 
                          {creneau.heureDebut} - {creneau.heureFin}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant={creneau.est_disponible ? 'default' : 'secondary'}>
                            {creneau.est_disponible ? 'Disponible' : 'Complet'}
                          </Badge>
                          <Badge variant="outline">
                            Max {creneau.nbreLimitePatient} patient{creneau.nbreLimitePatient > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                        
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(creneau.groupeId, creneau.idCreneau)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}