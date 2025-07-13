'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, MapPin, Lock, Pencil, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/useAuth';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    phone: '',
    address: '',
    city: 'Dakar',
    postalCode: '10000',
    country: 'Sénégal'
  });

  useEffect(() => {
    setToken(sessionStorage.getItem('auth_token'));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      setIsLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Patients/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile({
          firstName: data.prenom || '',
          lastName: data.nom || '',
          email: data.email || '',
          birthDate: data.ddn || '',
          phone: data.telephone || '',
          address: data.adresse || '',
          city: data.ville || 'Dakar',
          postalCode: data.codePostal || '10000',
          country: data.pays || 'Sénégal'
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Erreur", {
          description: "Impossible de charger les informations du profil"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Patients/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          birthDate: profile.birthDate,
          address: profile.address,
          city: profile.city,
          postalCode: profile.postalCode,
          country: profile.country
        })
      });

      if (!response.ok) throw new Error('Update failed');

      toast.success("Profil mis à jour", {
        description: "Vos informations ont été sauvegardées avec succès"
      });

      await refreshUser();
      setEditMode(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error("Erreur", {
        description: "Échec de la mise à jour du profil"
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseignée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/95 to-emerald-50/95 dark:from-gray-950 dark:to-emerald-950/95 py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-lg rounded-xl overflow-hidden">
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-700 dark:to-teal-800" />
              
              <div className="absolute -bottom-16 left-6">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900 shadow-lg">
                  <AvatarImage src="/avatars/patient.jpg" alt="Photo de profil" />
                  <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-3xl font-bold">
                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="absolute top-4 right-4">
                {isLoading ? (
                  <Skeleton className="h-10 w-24 rounded-lg" />
                ) : (
                  <Button 
                    variant={editMode ? "outline" : "default"} 
                    onClick={() => setEditMode(!editMode)}
                    className="gap-2 shadow-md"
                  >
                    <Pencil className="w-4 h-4" />
                    {editMode ? 'Annuler' : 'Modifier'}
                  </Button>
                )}
              </div>
            </div>

            <CardHeader className="pt-20 pb-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ) : (
                <>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.firstName} {profile.lastName}
                  </CardTitle>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Patient chez Clinique Amitié 
                  </p>
                </>
              )}
            </CardHeader>

            <Separator className="my-2" />

            <CardContent className="py-6">
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.form
                    key="edit-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Téléphone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Date de naissance
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          name="birthDate"
                          value={profile.birthDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Adresse
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={profile.address}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={profile.postalCode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          name="city"
                          value={profile.city}
                          onChange={handleChange}
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
                      <Button type="submit">Enregistrer les modifications</Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="view-mode"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileField 
                        icon={<User className="w-5 h-5" />}
                        label="Nom complet"
                        value={`${profile.firstName} ${profile.lastName}`}
                        loading={isLoading}
                      />
                      <ProfileField 
                        icon={<Mail className="w-5 h-5" />}
                        label="Email"
                        value={profile.email}
                        loading={isLoading}
                      />
                      <ProfileField 
                        icon={<Calendar className="w-5 h-5" />}
                        label="Date de naissance"
                        value={formatDate(profile.birthDate)}
                        loading={isLoading}
                      />
                      <ProfileField 
                        icon={<Phone className="w-5 h-5" />}
                        label="Téléphone"
                        value={profile.phone || 'Non renseigné'}
                        loading={isLoading}
                      />
                      <ProfileField 
                        icon={<MapPin className="w-5 h-5" />}
                        label="Adresse"
                        value={
                          profile.address 
                            ? `${profile.address}, ${profile.postalCode} ${profile.city}, ${profile.country}`
                            : 'Non renseignée'
                        }
                        className="md:col-span-2"
                        loading={isLoading}
                      />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <Button variant="ghost" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Lock className="w-5 h-5" />
                          Modifier le mot de passe
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileField({ 
  icon, 
  label, 
  value, 
  className = '',
  loading = false
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  className?: string;
  loading?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-full" />
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-gray-900 dark:text-white break-words">{value}</p>
          </>
        )}
      </div>
    </div>
  );
}