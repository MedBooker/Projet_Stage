'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, MapPin, Lock, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [annee, setAnnee] = useState('');
  const { refreshUser } = useAuth();

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
  }, []);

  useEffect(() => {
    const getInfos = async () => {
      if (!token) return;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/Patients/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        const data = await response.json();
        setProfile({
          firstName: data.prenom,
          lastName: data.nom,
          email: data.email,
          birthDate: data.ddn,
          phone: data.telephone,
          address: data.adresse,
          city: 'Dakar',
          postalCode: '10000',
          country: 'Sénégal'
        });
        setAnnee(data.anneeCreation);
      } catch (error) {
        console.error("Erreur lors du chargement des informations :", error);
        toast.error("Erreur", {
          description: "Impossible de charger votre profil."
        });
      }
    };

    if (token) {
      getInfos();
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/Patients/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour');
      }

      toast.success("Profil mis à jour", {
        description: "Vos informations ont été sauvegardées"
      });

      await refreshUser();

    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour de votre profil."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-emerald-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden">
          <div className="bg-emerald-600 dark:bg-emerald-800 h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
                <AvatarImage src="/avatars/patient.jpg" alt="Photo de profil" />
                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-3xl font-bold">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardHeader className="pt-20 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Patient depuis {annee}</p>
              </div>
              <Button 
                variant={editMode ? "outline" : "default"} 
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                {editMode ? 'Annuler' : 'Modifier le profil'}
              </Button>
            </div>
          </CardHeader>
          <Separator className="mb-6" />
          <CardContent className="pb-8">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium">
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium">
                      Nom
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Téléphone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="birthDate" className="block text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date de naissance
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      name="birthDate"
                      value={profile.birthDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Adresse
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="block text-sm font-medium">
                      Code postal
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      value={profile.postalCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium">
                      Ville
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditMode(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField 
                    icon={<User className="w-5 h-5" />}
                    label="Nom complet"
                    value={`${profile.firstName} ${profile.lastName}`}
                  />
                  <ProfileField 
                    icon={<Mail className="w-5 h-5" />}
                    label="Email"
                    value={profile.email}
                  />
                  <ProfileField 
                    icon={<Calendar className="w-5 h-5" />}
                    label="Date de naissance"
                    value={new Date(profile.birthDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  />
                  <ProfileField 
                    icon={<Phone className="w-5 h-5" />}
                    label="Téléphone"
                    value={profile.phone}
                  />
                  <ProfileField 
                    icon={<MapPin className="w-5 h-5" />}
                    label="Adresse"
                    value={`${profile.address}, ${profile.postalCode} ${profile.city}, ${profile.country}`}
                    className="md:col-span-2"
                  />
                </div>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" /> Sécurité
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      Changer mon mot de passe
                    </Button>
                    <Button variant="outline" className="justify-start">
                      Authentification à deux facteurs
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileField({ 
  icon, 
  label, 
  value, 
  className = '' 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  className?: string; 
}) {
  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}