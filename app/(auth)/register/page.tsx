'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, EyeOff, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

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
      title: 'Sécurité du Compte',
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
      setCurrentStep(prev => prev + 1);
    } else {
      toast.warning("Champs manquants", {
        description: "Veuillez remplir tous les champs obligatoires avant de continuer."
      });
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;

    return currentFields.every(field => {
      if (field === 'assurance') return true;
      const value = formData[field as keyof typeof formData];
      return value !== null && value !== '';
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/Patients/register-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error("Erreur", {
          description: data.message || "Une erreur est survenue lors de la demande d'inscription"
        });
        return;
      }
      toast.success("Demande envoyée", {
        description: "Votre demande d'inscription a été soumise avec succès. Vous recevrez un email une fois votre compte validé.",
        action: {
          label: "OK",
          onClick: () => router.push('/')
        },
      });
      setTimeout(() => router.push('/'), 3000);
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la demande d'inscription"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-sm font-medium text-gray-700 dark:text-gray-300">Prénom *</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  placeholder="Mamadou"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom *</Label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder="Ndiaye"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sexe" className="text-sm font-medium text-gray-700 dark:text-gray-300">Sexe *</Label>
                <Select
                  value={formData.sexe}
                  onValueChange={(value) => handleSelectChange('sexe', value)}
                >
                  <SelectTrigger className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                    <SelectItem value="homme">Homme</SelectItem>
                    <SelectItem value="femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateDeNaissance" className="text-sm font-medium text-gray-700 dark:text-gray-300">Date de naissance *</Label>
                <Input
                  id="dateDeNaissance"
                  name="dateDeNaissance"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.dateDeNaissance}
                  onChange={handleChange}
                  required
                  className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroDeTelephone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Numéro de téléphone *</Label>
              <Input
                id="numeroDeTelephone"
                name="numeroDeTelephone"
                type="text"
                placeholder="+221 77 123 45 68"
                value={formData.numeroDeTelephone}
                onChange={(e) => {
                  let input = e.target.value.replace(/\s/g, '');
                  if (input === '' || input === '+221') {
                    setFormData(prev => ({ ...prev, numeroDeTelephone: '' }));
                    return;
                  }
                  if (input.startsWith('+221')) input = input.slice(4);
                  let raw = input.replace(/\D/g, '').slice(0, 9);
                  let displayValue = '+221';
                  if (raw.length > 0) displayValue += ' ' + raw.slice(0, 2);
                  if (raw.length > 2) displayValue += ' ' + raw.slice(2, 5);
                  if (raw.length > 5) displayValue += ' ' + raw.slice(5, 9);
                  setFormData(prev => ({ ...prev, numeroDeTelephone: displayValue }));
                }}
                required
                className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format attendu : +221 70 398 55 44
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse" className="text-sm font-medium text-gray-700 dark:text-gray-300">Adresse *</Label>
              <Input
                id="adresse"
                name="adresse"
                placeholder="Dakar, Sénégal"
                value={formData.adresse}
                onChange={handleChange}
                required
                className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assurance" className="text-sm font-medium text-gray-700 dark:text-gray-300">Assurance maladie</Label>
              <div>
                {isAutreAssurance && formData.assurance !== 'Aucune' ? (
                  <Input
                    id="otherAssurance"
                    placeholder="Entrez le nom de votre assurance"
                    value={autreAssuranceValue}
                    onChange={(e) => {
                      setAutreAssuranceValue(e.target.value);
                      setFormData(prev => ({ ...prev, assurance: e.target.value }));
                    }}
                    className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                    disabled={formData.assurance === 'Aucune'}
                  />
                ) : (
                  <Select
                    value={formData.assurance === 'Aucune' ? '' : formData.assurance}
                    onValueChange={(value) => {
                      if (value === 'Autre') {
                        setIsAutreAssurance(true);
                        setFormData(prev => ({ ...prev, assurance: '' }));
                      } else {
                        setIsAutreAssurance(false);
                        setFormData(prev => ({ ...prev, assurance: value }));
                      }
                    }}
                    disabled={formData.assurance === 'Aucune'}
                  >
                    <SelectTrigger className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500">
                      <SelectValue placeholder="Sélectionnez votre assurance" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                      {assurances.map((assurance) => (
                        <SelectItem key={assurance} value={assurance}>
                          {assurance}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-3">
                <input
                  type="checkbox"
                  id="noInsurance"
                  checked={formData.assurance === 'Aucune'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({ ...prev, assurance: 'Aucune' }));
                      setIsAutreAssurance(false);
                      setAutreAssuranceValue('');
                    } else {
                      setFormData(prev => ({ ...prev, assurance: '' }));
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:text-emerald-500 dark:border-gray-600"
                />
                <label htmlFor="noInsurance" className="text-sm text-gray-700 dark:text-gray-300">
                  Je n'ai pas d'assurance maladie
                </label>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe *</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="space-y-2 mt-3">
                {passwordRequirements.map(req => (
                  <div key={req.id} className="flex items-center text-xs">
                    {req.validator(formData.password) ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-gray-400 mr-2" />
                    )}
                    <span className={req.validator(formData.password) ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmer le mot de passe *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-11 bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">Les mots de passe ne correspondent pas</p>
              )}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/90 via-teal-50/90 to-blue-50/90 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-emerald-100/30 dark:border-emerald-900/20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Créer une demande d'inscription</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {steps[currentStep].title}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-600 rounded-full"
              initial={{ width: `${(currentStep) * 33.33}%` }}
              animate={{ width: `${(currentStep + 1) * 33.33}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            {currentStep > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="gap-1.5 px-4 py-2.5 text-sm font-medium"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
            ) : (
              <div /> 
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid() || isLoading}
                className="ml-auto gap-1.5 px-4 py-2.5 text-sm font-medium"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || formData.password !== formData.confirmPassword || passwordErrors.length > 0}
                className="ml-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 text-sm font-medium shadow-md hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Envoyer la demande
                  </span>
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Déjà un compte ?{' '}
            <a 
              href="/login" 
              className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 hover:underline font-medium transition-colors"
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}