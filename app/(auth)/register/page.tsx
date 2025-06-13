'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { z } from 'zod';


export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    sexe: '',
    dateDeNaissance: '',
    numeroDeTelephone: '',
    adresse: '',
    assurance: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutreAssurance, setIsAutreAssurance] = useState(false);
  const [autreAssuranceValue, setAutreAssuranceValue] = useState('');

  const steps = [
    {
      title: 'Informations Personnelles',
      fields: ['prenom', 'nom', 'sexe', 'dateDeNaissance']
    },
    {
      title: 'Coordonnées & Assurance',
      fields: ['email', 'numeroDeTelephone', 'adresse', 'assurance']
    },
    {
      title: 'Mot de Passe',
      fields: ['password', 'confirmPassword']
    }
  ];

  const passwordRequirements = [
    { id: 1, text: "8 caractères minimum", validator: (p: string) => p.length >= 8 },
    { id: 2, text: "1 majuscule", validator: (p: string) => /[A-Z]/.test(p) },
    { id: 3, text: "1 chiffre", validator: (p: string) => /[0-9]/.test(p) },
    { id: 4, text: "1 caractère spécial", validator: (p: string) => /[!@#$%^&*]/.test(p) },
  ];

  const assurances = [
    "Mutuelle santé",
    "AXA",
    "ASKIA",
    "Allianz",
    "Groupama",
    "MGEN",
    "Harmonie Mutuelle",
    "Autre"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const result = z.string()
        .min(8, "8 caractères minimum")
        .regex(/[A-Z]/, "Doit contenir une majuscule")
        .regex(/[0-9]/, "Doit contenir un chiffre")
        .regex(/[!@#$%^&*]/, "Doit contenir un caractère spécial")
        .safeParse(value);

      if (!result.success) {
        setPasswordErrors(result.error.errors.map(err => err.message));
      } else {
        setPasswordErrors([]);
      }
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => formData[field as keyof typeof formData]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/Patients/register', {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error("Erreur", {
          description: (data.message || "Une erreur est survenue lors de l'inscription")
        });
        return;
      }
      toast.success("Inscription réussie", {
        description: "Redirection vers la connexion...",
        action: {
          label: "Se connecter",
          onClick: () => router.push('/login')
        },
      });

      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
        toast.error("Erreur", {
          description: "Une erreur est survenue lors de l'inscription"
        });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  placeholder="Mamadou"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder="Ndiaye"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="sexe">Sexe *</Label>
                <Select
                  value={formData.sexe}
                  onValueChange={(value) => handleSelectChange('sexe', value)}
                >
                  <SelectTrigger className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homme">Homme</SelectItem>
                    <SelectItem value="femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="dateDeNaissance">Date de naissance *</Label>
                <Input
                  id="dateDeNaissance"
                  name="dateDeNaissance"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.dateDeNaissance}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div className="space-y-3">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="numeroDeTelephone">Numéro de téléphone *</Label>
              <Input
                id="numeroDeTelephone"
                name="numeroDeTelephone"
                type="text"
                placeholder="+221 77 123 45 68"
                value={formData.numeroDeTelephone}
                onChange={(e) => {
                  const raw = e.target.value;
                  const numeric = raw.replace(/[^0-9+]/g, '');
                  setFormData(prev => ({ ...prev, numeroDeTelephone: numeric }));
                }}
                required
                className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Format attendu : +221 77 123 45 68
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="adresse">Adresse *</Label>
              <Input
                id="adresse"
                name="adresse"
                placeholder="Dakar, Sénégal"
                value={formData.adresse}
                onChange={handleChange}
                required
                className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="assurance">Assurance maladie</Label>
              <div>
                {isAutreAssurance ? (
                  <Input
                    id="otherAssurance"
                    placeholder="Entrez le nom de votre assurance"
                    value={autreAssuranceValue}
                    onChange={(e) => {
                      setAutreAssuranceValue(e.target.value);
                      setFormData(prev => ({ ...prev, assurance: e.target.value }));
                    }}
                    required
                    className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <Select
                    value={formData.assurance}
                    onValueChange={(value) => {
                      if (value === 'Autre') {
                        setIsAutreAssurance(true);
                        setFormData(prev => ({ ...prev, assurance: 'Autre' }));
                      } else {
                        setFormData(prev => ({ ...prev, assurance: value }));
                      }
                    }}
                  >
                    <SelectTrigger className="dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500">
                      <SelectValue placeholder="Sélectionnez votre assurance" />
                    </SelectTrigger>
                    <SelectContent>
                      {assurances.map((assurance) => (
                        <SelectItem key={assurance} value={assurance}>
                          {assurance}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="space-y-3">
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="space-y-2 mt-2">
                {passwordRequirements.map(req => (
                  <div key={req.id} className="flex items-center text-xs">
                    {req.validator(formData.password) ? (
                      <Check className="h-3 w-3 text-emerald-500 mr-2" />
                    ) : (
                      <X className="h-3 w-3 text-gray-400 mr-2" />
                    )}
                    <span className={req.validator(formData.password) ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-gray-900 px-4 py-12">
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-emerald-100/50 dark:border-emerald-900/30">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {index + 1}
              </div>
            ))}
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep + 1) * 33.33}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="text-emerald-600 dark:text-emerald-400"
              >
                Précédent
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid() || isLoading}
                className="ml-auto"
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || formData.password !== formData.confirmPassword}
                className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création...
                  </span>
                ) : "S'inscrire"}
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-800/50 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Déjà un compte ?{' '}
            <a href="/login" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}