'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AddUserPage() {
  const [specialite, setSpecialite] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);

interface NewUser {
    prenom: string;
    nom: string;
    email: string;
    password: string;
    specialite: string;
}

useEffect(() => {
  setToken(sessionStorage.getItem('auth_token'));
},[]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Admin/register-doctor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({specialite, prenom, nom, email, password})
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du médecin, veuillez réessayer.');
      }
      const newUser: NewUser = {
        prenom,
        nom,
        email,
        password,
        specialite
      };
      console.log("Nouvel utilisateur :", newUser);
      alert("Compte ajouté !");
    } catch (error) {
        console.error('Erreur:', error);
    }
};

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un medecin</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label className="my-3" htmlFor="prenom">Prenom</Label>
              <Input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
            </div>
            <div>
              <Label className="my-3" htmlFor="nom">Nom</Label>
              <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div>
              <Label className="my-3" htmlFor="role">Spécialité</Label>
              <Select value={specialite} onValueChange={(val) => setSpecialite(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une spécialité"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
                  <SelectItem value="Gynécologie">Gynécologie</SelectItem>
                  <SelectItem value="Neurologie">Neurologie</SelectItem>
                  <SelectItem value="Radiologie">Radiologie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="my-3" htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label className="my-3" htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-end">
            <Button type="submit" className="my-5 bg-emerald-600 hover:bg-emerald-700 text-white">
              Ajouter
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}