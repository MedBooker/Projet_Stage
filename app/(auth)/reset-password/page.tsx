'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import { z } from 'zod';

const passwordSchema = z.string().min(8, "8 caractères minimum")
  .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
  .regex(/[0-9]/, "Doit contenir au moins un chiffre")
  .regex(/[!@#$%^&*]/, "Doit contenir un caractère spécial");

export default function ResetPasswordPage() {
  // const searchParams = useSearchParams();
  // const token = searchParams.get('token');
  // const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const token = useSearchParams().get('token');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const result = passwordSchema.safeParse(value);
      if (!result.success) {
        setPasswordErrors(result.error.errors.map(err => err.message));
      } else {
        setPasswordErrors([]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Patients/modify-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password: formData.password })
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error("Erreur d'authentification", {
          description: "Utilisateur non authorisé a modifier son mot de passe",
        });
        return;
      }
      
      toast.success("Mot de passe mis à jour", {
        description: "Votre mot de passe a été réinitialisé avec succès",
        action: {
          label: "Se connecter",
          onClick: () => router.push('/login')
        },
      });

      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la réinitialisation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { id: 1, text: "8 caractères minimum", validator: (p: string) => p.length >= 8 },
    { id: 2, text: "1 majuscule", validator: (p: string) => /[A-Z]/.test(p) },
    { id: 3, text: "1 chiffre", validator: (p: string) => /[0-9]/.test(p) },
    { id: 4, text: "1 caractère spécial", validator: (p: string) => /[!@#$%^&*]/.test(p) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/50 to-teal-100/50 dark:from-gray-900 dark:to-emerald-950/50 px-4 py-12">
      <div className="relative bg-white dark:bg-gray-900 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-emerald-100/50 dark:border-emerald-900/30">
        <Link href="/login" className="absolute top-6 left-6 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-500 dark:text-gray-400">
            { 'Entrez votre nouveau mot de passe'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Nouveau mot de passe *</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirmer le mot de passe *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 dark:text-gray-500 dark:hover:text-emerald-400 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={isLoading || passwordErrors.length > 0}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Réinitialisation...
              </span>
            ) : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </div>
    </div>
  );
}